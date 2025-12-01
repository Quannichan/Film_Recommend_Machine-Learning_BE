const express = require("express")
const Router = express.Router()
const mw = require("../../middleware/middelware")
const loginController = require("../../controller/loginController");
const registerController = require("../../controller/registerController")

//login

Router.post("/login", new loginController().login)

Router.post("/islogin", mw.checklogin(["SUPADM", "NORM"]));

//register

Router.post("/register",  new registerController().register)


module.exports = Router