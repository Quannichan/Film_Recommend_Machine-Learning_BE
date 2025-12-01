const natural = require("natural");
const { prisma } = require("../config/connectSql");

class VectorFilms {

    constructor() {
        this.corpus = null;
        this.films = null;

        this.tfidf = new natural.TfIdf();

        this.vocab = [];
        this.vocabIndex = {};
        this.movieVectors = [];
    }

    cosineSimilarity(vecA, vecB) {
        let dot = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async init() {
        const filmsData = await prisma.postSample.findMany({
            include: {
                country: { include: { country: true } },
                genre: { include: { genre: true } }
            }
        });

        if (!filmsData) return;

        const result = filmsData.map(film => ({
            ...film,
            country: film.country.map(c => c.country.slug),
            genre: film.genre.map(g => g.genre.slug)
        }));

        this.films = result;
        this.corpus = result.map(this.movieToText);

        this.corpus.forEach(doc => this.tfidf.addDocument(doc));

        this.buildVocabulary();

        this.movieVectors = this.films.map((_, index) =>
            this.getMovieVector(index)
        );

        console.log("TF-IDF init complete. Vocab size:", this.vocab.length);
    }

    movieToText(movie) {
        return [
            movie.name_en?.toLowerCase() || "",
            movie.genre.join(" "),
            movie.country.join(" "),
        ].join(" ");
    }

    buildVocabulary() {
        const vocabSet = new Set();

        this.corpus.forEach((_, docIndex) => {
            this.tfidf.listTerms(docIndex).forEach(t => vocabSet.add(t.term));
        });

        this.vocab = Array.from(vocabSet);

        this.vocab.forEach((term, index) => {
            this.vocabIndex[term] = index;
        });

        console.log("Vocabulary built:", this.vocab.length, "terms");
    }

    getMovieVector(docIndex) {
        const vec = Array(this.vocab.length).fill(0);

        const terms = this.tfidf.listTerms(docIndex);
        terms.forEach(t => {
            const idx = this.vocabIndex[t.term];
            if (idx !== undefined) {
                vec[idx] = t.tfidf;
            }
        });

        return vec;
    }

    async getVectorForLike(userId) {
        const likedMovies = await prisma.postSampleFavourites.findMany({
            where: { userId },
            select: { postSampleId: true }
        });

        let vectors = likedMovies.map(movie => {
            const index = this.films.findIndex(m => m.id === movie.postSampleId);
            return this.movieVectors[index];
        });

        return this.averageVector(vectors);
    }

    async recommendMovies(id, profileVector, topK = 20) {
        const results = [];

        for (let i = 0; i < this.movieVectors.length; i++) {
            const sim = this.cosineSimilarity(profileVector, this.movieVectors[i]);

            results.push({
                postsample: this.films[i],
                score: sim
            });
        }

        results.sort((a, b) => b.score - a.score);
        
        var fav = await prisma.postSampleFavourites.findMany({
            where: {
                userId: id
            },
            select: {
                postSampleId: true
            }
        })

        var fa = []
        for(var f of fav){
            fa.push(f.postSampleId)
        }

        var results_new = []
        for(var r of results){
            if(!fa.includes(r.postsample.id)){
                results_new.push(r)
            }
        }

        return results_new.slice(0, topK);
    }

    averageVector(vectors) {
        if (!vectors.length) return [];

        const length = this.vocab.length;
        const sums = Array(length).fill(0);

        vectors.forEach(vec => {
            vec.forEach((val, i) => sums[i] += val);
        });

        return sums.map(sum => sum / vectors.length);
    }
}

const vf = new VectorFilms();
module.exports = vf;
