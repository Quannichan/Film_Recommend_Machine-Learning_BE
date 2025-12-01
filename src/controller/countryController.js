const countryModel = require("../models/countryModel");

class countryController{
    async Service_Country_Publ(req, res){
        try{
            await new countryModel().doServicePublic(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async ADM_Service_Country(req, res){
        try{
            await new countryModel().doServiceAdmin(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

}

module.exports = countryController