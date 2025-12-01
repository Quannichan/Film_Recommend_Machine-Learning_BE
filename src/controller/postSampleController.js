const postSampleModel = require("../models/postSampleModel")

class postSampleController{

    async Service_public(req, res){
        try{
            await new postSampleModel().doServicePublic(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
    }

    async Service(req, res){
        try{
            await new postSampleModel().doService(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
    }

    async Service_admin(req, res){
        try{
            await new postSampleModel().doServiceAdmin(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
    }

    
}

module.exports = postSampleController