const path = require('path');
const express = require("express")
const Router = require("express").Router()

Router.use(express.static(path.join(__dirname, '..','..', '..', 'images')));


module.exports = Router