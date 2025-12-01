const express = require("express")
const PostSampleCtrl = require("../../controller/postSampleController")
const Router = express.Router()

Router.post("/", new PostSampleCtrl().Service)

module.exports = Router