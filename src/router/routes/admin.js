const express = require("express")
const infoController = require("../../controller/infoController")
const postSampleController = require("../../controller/postSampleController");
const genreController = require("../../controller/genreController");
const countryController = require("../../controller/countryController");

const Router = express.Router()

Router.post("/user", new infoController().ADM_Service_User);

Router.post("/postsample", new postSampleController().Service_admin);

Router.post("/genre", new genreController().ADM_Service_Genre);

Router.post("/country", new countryController().ADM_Service_Country);

module.exports = Router