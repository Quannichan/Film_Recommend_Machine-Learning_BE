const { prisma } = require("../config/connectSql");
const { CountryModDTO } = require("../DTO/country/CountryModDTO");
const { CountryNewDTO } = require("../DTO/country/CountryNewDTO");
const { CountryPageDTO } = require("../DTO/country/CountryPageDTO");
const { PostSamplePageDTO } = require("../DTO/post_sample/PostSamplePageDTO");

class countryModel{

    async doServicePublic(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvPage":
                    this.getPage(req, res);
                    break;

                case "SvGetLst":
                    this.getLst(req, res);
                    break;
                    
                default:
                    res.json({
                        "status" : 2004,
                    })
                    break;
            }
        }else{
            res.json({
                "status" : 2004,
            })
        }
    }

    async getPage(req, res){
        const postSamplePageData = CountryPageDTO(req);
        postSamplePageData.skip = (postSamplePageData.page - 1) * postSamplePageData.size;

        const postLstPage = await prisma.country.findMany({
                skip : postSamplePageData.skip, 
                take : postSamplePageData.size,
                orderBy : {
                    id : "desc"
                },
        });

        const total =  await prisma.country.count({
            orderBy : {
                id : "desc"
            },
        });

        const totalPages = Math.ceil(total / postSamplePageData.size);

        res.json({
            status     : 2000,
            data       : postLstPage,
            total      : totalPages,
            next       : postSamplePageData.page < totalPages ? true : false  
        });
    
    }

    async getLst(req,res){
        const data= await prisma.country.findMany();

        res.json({
            status     : 2000,
            data       : data,
        });
    }

    async doServiceAdmin(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvGet":
                    this.get(req, res);
                    break;

                case "SvNew":
                    this.new(req, res);
                    break;

                case "SvMod":
                    this.mod(req, res);
                    break;

                case "SvDel":
                    this.del(req, res);
                    break;
                    
                default:
                    res.json({
                        "status" : 2004,
                    })
                    break;
            }
        }else{
            res.json({
                "status" : 2004,
            })
        }
    }

    async get(req, res){
        if(!req.body.id){
            return res.json({
                "status" : 2001,
            })
        }

        if(isNaN(req.body.id)){
            return res.json({
                "status" : 2001,
            })
        }

        const postSample = await prisma.country.findUnique({
            where: {
                id : req.body.id * 1
            }
        });

        if(postSample.id){
            res.json({
                status : 2000,
                data: postSample
            })
        }else{
            res.json({
                "status" : 2002,
            })
        }
    }

    async new(req, res){
        const postSampleNewData = CountryNewDTO(req);
        
        var check = false;
        for(var k in postSampleNewData){
            if(postSampleNewData.hasOwnProperty(k)){
                if(postSampleNewData[k] === null || postSampleNewData[k] === "" || postSampleNewData[k] === undefined || postSampleNewData[k].length === 0){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                status : 2001,
                msg : "Bạn chưa nhập đầy đủ thông tin!"
            });
        }
        
        const newPostSample = await prisma.country.create({
            data: {
                ...postSampleNewData
            }
        });

        if(newPostSample.id){  
            res.json({
                status : 2000
            });
        }else{
            res.json({
                status : 2002
            });
        }
    }

    async mod(req, res){
        const postSampleModData = CountryModDTO(req);

        if(!postSampleModData.id){
            return res.json({
                status : 2001,
            });
        }

        var check = false;
        for(var k in postSampleModData){
            if(postSampleModData.hasOwnProperty(k)){
                if(postSampleModData[k] === null || postSampleModData[k] === "" || postSampleModData[k] === undefined || postSampleModData[k].length === 0){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                status : 2001,
                msg : "Bạn chưa nhập đầy đủ thông tin!"
            });
        }

        const id = postSampleModData.id
        delete postSampleModData.id
        
        const modPostSample = await prisma.country.update({
            where : {
                id : id
            },
            data: {
                ...postSampleModData
            }
        });

        if(modPostSample.id){  
            res.json({
                status : 2000
            });
        }else{
            res.json({
                status : 2002
            });
        }
    }

    async del(req, res){
        if(!req.body.id){
            return res.json({
                status : 2001,
            });
        }

        if(req.u.BASEROLE !== "SUPADM"){
            return res.json({
                status : 2004,
            });
        }

        await prisma.country.delete({
            where : {
                id : req.body.id * 1
            }
        });

        res.json({
            status : 2000
        });
        
    }
}

module.exports = countryModel;