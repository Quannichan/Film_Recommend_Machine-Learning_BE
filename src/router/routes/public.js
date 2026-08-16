const express = require("express");
const image = require("./image")
const video = require("./video")
const Router = express.Router()
const infoController = require("../../controller/infoController");
const postSampleController = require("../../controller/postSampleController");
const countryController = require("../../controller/countryController");
const genreController = require("../../controller/genreController");

Router.use("/images", image);

Router.use("/videos", video);

Router.post("/postSamplePubl", new postSampleController().Service_public);

Router.post("/userPubl", new infoController().Service_User_Publ);

Router.post("/countryPubl", new countryController().Service_Country_Publ);

Router.post("/genrePubl", new genreController().Service_Genre_Publ);

Router.get("/verify/account", new infoController().Service_User_Get_Publ);
    
module.exports = Router