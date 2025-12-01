const genreModel = require("../models/genreModel");

class genreController{
    async Service_Genre_Publ(req, res){
        try{
            await new genreModel().doServicePublic(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async ADM_Service_Genre(req, res){
        try{
            await new genreModel().doServiceAdmin(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

}

module.exports = genreController