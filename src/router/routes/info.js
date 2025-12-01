const express = require("express")
const infoController = require("../../controller/infoController")
const Router = express.Router()

Router.post("/", new infoController().Service_User)

module.exports = Router