const { prisma } = require("../config/connectSql");
const sharp = require("sharp");
const namer = require("color-namer");
const { kmeans } = require("ml-kmeans");
const path = require('path');

async function pMap(items, mapper, concurrency = 8) {
    const results = new Array(items.length);
    let cursor = 0;

    async function worker() {
        while (cursor < items.length) {
            const i = cursor++;
            results[i] = await mapper(items[i], i);
        }
    }

    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        worker
    );
    await Promise.all(workers);
    return results;
}

class VectorColor {
    constructor(){
        this.colorVocab = [];
        this.vocabIndex = new Map();
        this.movieVectors = [];
        this.films = [];
        this.movieIndex = new Map();
    }

    async init(filmsData, concurrency = 8){
        console.log("===== START CREATE VECTOR FROM POSTER =====");
        
        if (!filmsData || filmsData.length === 0)
            return;

        this.films = filmsData;

        this.movieIndex = new Map(
            this.films.map((f, i) => [f.id, i])
        );

        const posterPaths = filmsData.map(fd =>
            path.join(__dirname, "..", "..", "images", fd.img)
        );

        const extractedList = await pMap(
            posterPaths,
            (p) => this.ExtractColor(p),
            concurrency
        );

        for (const extracted of extractedList) {
            for (const ext of extracted) {
                if (!this.vocabIndex.has(ext.color)) {
                    this.vocabIndex.set(ext.color, true);
                    this.colorVocab.push(ext.color);
                }
            }
        }
        this.colorVocab.sort();
        this.vocabIndex = new Map(this.colorVocab.map((c, i) => [c, i]));

        this.movieVectors = extractedList.map(extracted =>
            this.CreateColorVector(extracted)
        );

        console.log("Poster color vector init complete. Vocab size:", this.colorVocab.length);
    }

    CreateColorVector(extractedColors) {
        const vector = new Array(this.colorVocab.length).fill(0);
        for (const color of extractedColors) {
            const index = this.vocabIndex.get(color.color);
            if (index !== undefined) {
                vector[index] = color.weight;
            }
        }
        return vector;
    }

    async ExtractColor(imgPath){
        const { data } = await sharp(imgPath)
            .resize(100, 150)
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = [];
        const sampleStep = 10;
        for (let i = 0; i < data.length; i += sampleStep * 3) {
            pixels.push([data[i], data[i + 1], data[i + 2]]);
        }

        const result = this.K_means(pixels);
        return this.ColorNaming(result);
    }

    ColorNaming(k_means_result) {
        const clusterCount = {};
        k_means_result.clusters.forEach(clusterId => {
            clusterCount[clusterId] = (clusterCount[clusterId] || 0) + 1;
        });

        const totalPixels = k_means_result.clusters.length;
        const colors = [];

        k_means_result.centroids.forEach((rgb, index) => {
            const r = Math.round(rgb[0]);
            const g = Math.round(rgb[1]);
            const b = Math.round(rgb[2]);

            const hex = "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");

            const color = namer(hex, { pick: ["basic"] }).basic[0].name;

            const weight = (clusterCount[index] || 0) / totalPixels;
            colors.push({ color, weight });
        });

        const merged = {};
        colors.forEach(c => {
            if (!merged[c.color]) merged[c.color] = 0;
            merged[c.color] += c.weight;
        });

        return Object.entries(merged)
            .map(([color, weight]) => ({ color, weight }))
            .sort((a, b) => b.weight - a.weight);
    }

    K_means(pixels, k = 5){
        return kmeans(pixels, k, {
            initialization: 'random',
            seed: 42
        });
    }

    averageVector(vectors) {
        if (!vectors.length) return [];
        const length = this.colorVocab.length;
        const sums = Array(length).fill(0);
        vectors.forEach(vec => {
            vec.forEach((val, i) => sums[i] += val);
        });
        return sums.map(sum => sum / vectors.length);
    }

    async getVectorColor(movies) {

        const vectors = movies
            .map(m => this.movieVectors[this.movieIndex.get(m.postSampleId)])
            .filter(Boolean);

        return this.averageVector(vectors);
    }

    async recommendMovies(movies, profileVector, topK = 20) {
        const moviesSet = new Set(movies.map(f => f.postSampleId));

        const results = [];

        for (let i = 0; i < this.movieVectors.length; i++) {

            if (moviesSet.has(this.films[i].id))
                continue;

            const sim = this.cosineSimilarity(profileVector, this.movieVectors[i]);

            results.push({
                postsample: this.films[i],
                score: sim
            });
        }

        results.sort((a, b) => b.score - a.score);

        return results.slice(0, topK);
    }

    cosineSimilarity(vecA, vecB) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

const vc = new VectorColor();
module.exports = vc;