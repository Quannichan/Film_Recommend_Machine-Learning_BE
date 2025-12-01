const infoModel = require("../models/infoModel")

class infoController{
    async Service_User(req, res){
        try{
            await new infoModel().doService(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async Service_User_Get_Publ(req, res){
        try{
            await new infoModel().doServicePublicGet(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async Service_User_Publ(req, res){
        try{
            await new infoModel().doServicePubl(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async ADM_Service_User(req, res){
        try{
            await new infoModel().doServiceADM(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

}

module.exports = infoController