const { prisma } = require("../config/connectSql");
const vc = require("./VectorColor");
const vf = require("./VectorFilms");
const { Worker } = require("worker_threads");
const path = require("path");

class RecommendTools{
    constructor(){
        this.films = [];
        this.ready = false;
        this.rebuilding = false;
    }

    async init(){
        const filmsData = await prisma.postSample.findMany({
            select:{
                id: true,
                date01: true,
                date02: true,
                img: true,
                film: true,
                name: true,
                name_en: true,
                releaseDate: true,
                trailer: true,
                descript: true,

                country: {
                    include: { country: true }
                },

                genre: {
                    include: { genre: true }
                }
            }
        });

        this.films = filmsData;

        this.rebuildVectors(filmsData);
    }

    async rebuildVectors(filmsData = this.films){

        if (this.rebuilding) {
            console.log("Vector rebuild is already running");
            return;
        }

        this.rebuilding = true;

        console.log("===== START VECTOR REBUILD =====");

        try {

            const result = await this.runVectorWorker(filmsData);

            vf.films = result.metadata.films;
            vf.vocab = result.metadata.vocab;
            vf.vocabIndex = result.metadata.vocabIndex;
            vf.movieVectors = result.metadata.movieVectors;

            vf.movieIndex = new Map(
                vf.films.map((f, i) => [f.id, i])
            );


            vc.films = result.color.films;
            vc.colorVocab = result.color.colorVocab;
            vc.vocabIndex = new Map(result.color.vocabIndex);
            vc.movieVectors = result.color.movieVectors;

            vc.movieIndex = new Map(
                vc.films.map((f, i) => [f.id, i])
            );


            this.ready = true;

            console.log("===== VECTOR REBUILD COMPLETE =====");

        } catch(error) {

            console.error("Vector rebuild failed:", error);

        } finally {

            this.rebuilding = false;

        }
    }

    async reInit(){

        if (this.rebuilding) {
            return {
                success: false,
                message: "Vector rebuild is already running"
            };
        }

        this.ready = false;

        const filmsData = await prisma.postSample.findMany({
            select:{
                id: true,
                date01: true,
                date02: true,
                img: true,
                film: true,
                name: true,
                name_en: true,
                releaseDate: true,
                trailer: true,
                descript: true,

                country: {
                    include: { country: true }
                },

                genre: {
                    include: { genre: true }
                }
            }
        });

        this.films = filmsData;

        // Chạy background
        this.rebuildVectors(filmsData);

        return {
            success: true,
            message: "Vector rebuild started"
        };
    }

    runVectorWorker(filmsData) {

        return new Promise((resolve, reject) => {

            const worker = new Worker(
                path.join(__dirname, "../workers/vectorWorker.js")
            );

            worker.on("message", (result) => {

                if (!result.success) {
                    reject(new Error(result.error));
                    return;
                }

                resolve(result);
            });

            worker.on("error", reject);

            worker.on("exit", (code) => {

                if (code !== 0) {
                    reject(
                        new Error(`Worker stopped with exit code ${code}`)
                    );
                }

            });

            worker.postMessage({
                filmsData
            });
        });
    }

    async getRecommend(id, user){

        var count_vec = 0

        if (!user.profile_v || user.profile_v.length === 0) {
            count_vec+=1;
        }

        if (!user.profile_v_watched || user.profile_v_watched.length === 0) {
            count_vec+=1;
        }

        if (!user.profile_v_color || user.profile_v_color.length === 0) {
            count_vec+=1;
        }

        if(count_vec === 3){
            return [];
        }

        var fav = await prisma.postSampleFavourites.findMany({
            where: {
                userId: id
            },
            select: {
                postSampleId: true
            }
        })

        var watched = await prisma.postSampleWatched.findMany({
            where: { 
                userId: id
            },
            select: { 
                postSampleId: true
            }
        });

        const movie_combine = [];
        const ids = []

        for (const movie of fav) {
            if(!ids.includes(movie.postSampleId)){
                ids.push(movie.postSampleId);
                movie_combine.push(movie);
            }
        }

        for (const movie of watched) {
            if(!ids.includes(movie.postSampleId)){
                ids.push(movie.postSampleId);
                movie_combine.push(movie);
            }
        }

        var recomm_like = [];
        var recomm_watched = [];
        var recomm_color = [];
        var count = 0

        if(fav.length > 0){
            recomm_like = await vf.recommendMovies(fav, user.profile_v);
        }else{
            count+=1;
        }

        if(watched.length > 0){
            recomm_watched = await await vf.recommendMovies(watched, user.profile_v_watched);
        }else{
            count+=1;
        }

        if(movie_combine.length > 0){
            recomm_color = await vc.recommendMovies(movie_combine, user.profile_v_color);
        }else{
            count+=1;
        }

        if(count === 3){
            return []
        }

        var results = []
        var id_exits = []

        for(var l of recomm_like){
            if(!id_exits.includes(l.postsample.id)){
                results.push(l);
                id_exits.push(l.postsample.id);
            }
        }

        for(var w of recomm_watched){
            if(!id_exits.includes(w.postsample.id)){
                results.push(w);
                id_exits.push(w.postsample.id);
            }
        }

        for(var c of recomm_color){
            if(!id_exits.includes(c.postsample.id)){
                results.push(c);
                id_exits.push(c.postsample.id);
            }
        }

        return results;
        
    }

    async getVector(userId){
        const likedMovies = await prisma.postSampleFavourites.findMany({
            where: { userId },
            select: { postSampleId: true }
        });

        const watchedMovies = await prisma.postSampleWatched.findMany({
            where: { userId },
            select: { postSampleId: true }
        });

        const movie_combine = [];
        const ids = []

        for (const movie of likedMovies) {
            if(!ids.includes(movie.postSampleId)){
                ids.push(movie.postSampleId);
                movie_combine.push(movie);
            }
        }

        for (const movie of watchedMovies) {
            if(!ids.includes(movie.postSampleId)){
                ids.push(movie.postSampleId);
                movie_combine.push(movie);
            }
        }

        var vec_like_meta = null;
        var vec_watched_meta = null;
        var vec_color = null;

        if(likedMovies.length > 0){
            vec_like_meta = await vf.getVectorMetaForLike(likedMovies);
        }

        if(watchedMovies.length > 0){
            vec_watched_meta = await vf.getVectorMetaForWatched(watchedMovies);
        }

        if(movie_combine.length > 0){
            vec_color = await vc.getVectorColor(movie_combine);
        }

        return {
            profile_v: vec_like_meta,
            profile_v_color: vec_color,
            profile_v_watched: vec_watched_meta
        }
    }
}

const rcmt = new RecommendTools();
module.exports = rcmt;