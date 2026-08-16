const { parentPort } = require("worker_threads");

const vf = require("../tools/VectorFilms");
const vc = require("../tools/VectorColor");

parentPort.on("message", async ({ filmsData }) => {

    try {

        console.log("===== VECTOR WORKER START =====");

        await Promise.all([
            vf.init(filmsData),
            vc.init(filmsData, 4)
        ]);

        console.log("===== VECTOR WORKER COMPLETE =====");

        parentPort.postMessage({
            success: true,

            metadata: {
                films: vf.films,
                vocab: vf.vocab,
                vocabIndex: vf.vocabIndex,
                movieVectors: vf.movieVectors
            },

            color: {
                films: vc.films,
                colorVocab: vc.colorVocab,
                vocabIndex: Array.from(vc.vocabIndex.entries()),
                movieVectors: vc.movieVectors
            }
        });

    } catch (error) {

        console.error("VECTOR WORKER ERROR:", error);

        parentPort.postMessage({
            success: false,
            error: error.stack || error.message
        });

    }
});