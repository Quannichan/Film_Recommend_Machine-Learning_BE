const natural = require("natural");
const { prisma } = require("../config/connectSql");

class VectorFilms {

    constructor() {
        this.corpus = null;
        this.films = null;

        this.tfidf = new natural.TfIdf();

        this.vocab = [];
        this.vocabIndex = new Map();
        this.movieVectors = [];

        this.movieIndex = new Map();
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

    async init(filmsData) {
        console.log("===== START CREATE VECTOR FROM METADATAS =====")
        if (!filmsData || filmsData.length === 0)
            return;

        const result = filmsData.map(film => ({
            ...film,
            country: film.country.map(c => c.country.slug),
            genre: film.genre.map(g => g.genre.slug),
            descript : film.descript
        }));

        this.films = result;

        this.movieIndex = new Map(
            this.films.map((f, i) => [f.id, i])
        );

        this.corpus = result.map(movie => this.movieToText(movie));

        this.corpus.forEach(doc => this.tfidf.addDocument(doc));

        this.buildVocabulary();

        this.movieVectors = this.films.map((_, index) =>
            this.getMovieVector(index)
        );

        console.log("TF-IDF metadata init complete. Vocab size:", this.vocab.length);
    }

    movieToText(movie) {
        return [
            movie.name_en?.toLowerCase() || "",
            movie.genre.join(" "),
            movie.country.join(" "),
            movie.descript?.toLowerCase() || ""
        ].join(" ");
    }

    buildVocabulary() {
        const vocabSet = new Set();

        this.corpus.forEach((_, docIndex) => {
            this.tfidf.listTerms(docIndex).forEach(t => vocabSet.add(t.term));
        });

        this.vocab = Array.from(vocabSet);

        this.vocab.forEach((term, index) => {
            this.vocabIndex.set(term, index);
        });

        console.log("Vocabulary built:", this.vocab.length, "terms");
    }

    getMovieVector(docIndex) {
        const vec = Array(this.vocab.length).fill(0);

        const terms = this.tfidf.listTerms(docIndex);
        terms.forEach(t => {
            const idx = this.vocabIndex.get(t.term);
            if (idx !== undefined) {
                vec[idx] = t.tfidf;
            }
        });

        return vec;
    }

    async getVectorMetaForLike(likedMovies) {
        const vectors = likedMovies
            .map(movie => this.movieVectors[this.movieIndex.get(movie.postSampleId)])
            .filter(Boolean);

        return this.averageVector(vectors);
    }

    async getVectorMetaForWatched(watchedMovies) {

        const vectors = watchedMovies
            .map(movie => this.movieVectors[this.movieIndex.get(movie.postSampleId)])
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
