const { prisma } = require("../config/connectSql");
const { PostSampleNewDTO } = require("../DTO/post_sample/PostSampleNewDTO");
const { PostSamplePageDTO } = require("../DTO/post_sample/PostSamplePageDTO");
const { PostSampleUpdateDTO } = require("../DTO/post_sample/PostSampleUpdateDTO");
const { writeFile } = require("../tools/commonTools");
const vf = require("../tools/VectorFilms");

class postSampleModel{
    async saveFile(name, d, savePath){
        return new Promise(async (resolve, reject)=>{
            const matches = d.match(/^data:(image\/\w+);base64,(.+)$/);
            const ext = matches[1].split('/')[1];
            const data = matches[2];
            const name_file = `${name}-image.${ext}`;
            await writeFile(name_file, data, savePath)
            .then(()=>{
                resolve(`${name_file}`);
            })
            .catch((err)=>{
                console.log(err);
                reject(null);
            })
        })
    }

    async doServicePublic(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvPage":
                    await this.getPage(req, res);
                    break;
                
                case "SvGet":
                    await this.get(req, res);
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
        const postSamplePageData = PostSamplePageDTO(req);
        postSamplePageData.skip = (postSamplePageData.page - 1) * postSamplePageData.size;

        const condition = {};

        if(postSamplePageData.search != ""){
            condition.OR = [
                {name : {
                    contains: postSamplePageData.search
                }},
                {name_en : {
                    contains: postSamplePageData.search
                }}
            ]
        }
        
        if(postSamplePageData.genreid){
            condition.genre = {
                some: {
                    genreId : postSamplePageData.genreid
                }
            }
        }

        if(postSamplePageData.countryid){
            condition.country = {
                some: {
                    countryId : postSamplePageData.countryid
                }
            }
        }

        const postLstPage = await prisma.postSample.findMany({
                skip : postSamplePageData.skip, 
                take : postSamplePageData.size,
                orderBy : {
                    id : "desc"
                },
                where : {
                    ...condition,
                },
                select:{
                    id: true,
                    name: true,
                    name_en: true,
                    descript: true,
                    img: true,
                    genre: true,
                    country: true
                }
        });

        const total =  await prisma.postSample.count({
            orderBy : {
                id : "desc"
            },
            where : {
                ...condition
            }
        });

        const totalPages = Math.ceil(total / postSamplePageData.size);

        res.json({
            status     : 2000,
            data       : postLstPage,
            total      : totalPages,
            next       : postSamplePageData.page < totalPages ? true : false  
        });
    
    }

    async doService(req,res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvFavourite":
                    await this.getFavourite(req, res);
                    break;

                case "SvRecommend":
                    await this.getRecommend(req, res);
                    break;

                case "SvLike":
                    await this.like(req, res);
                    break;

                case "SvUnLike":
                    await this.unlike(req, res);
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

    async getFavourite(req, res){
        const postSamplePageData = PostSamplePageDTO(req);
        postSamplePageData.skip = (postSamplePageData.page - 1) * postSamplePageData.size;
        
        var fav = await prisma.postSampleFavourites.findMany({
            skip : postSamplePageData.skip, 
            take : postSamplePageData.size,
            where: {
                userId: req.u.BASEID
            },
            select: {
                postsample: true
            }
        })

        const total =  await prisma.postSampleFavourites.count({
            where : {
                userId: req.u.BASEID
            }
        });

        const totalPages = Math.ceil(total / postSamplePageData.size);

        res.json({
            status     : 2000,
            data       : fav,
            total      : totalPages,
            next       : postSamplePageData.page < totalPages ? true : false  
        });
    }

    async getRecommend(req, res){
        var user = await prisma.user.findUnique({
            where: {
                id: req.u.BASEID
            },
            select: {
                profile_v: true
            }
        })

        if(user.profile_v.length > 0){
            const recommend = await vf.recommendMovies(req.u.BASEID, user.profile_v);
            res.json({
                "status" : 2000,
                "data": recommend
            })
        }else{
            res.json({
                "status" : 2000,
                "msg": "Bạn hãy thích ít nhất một phim để hệ thống có thể đề xuất!"
            })
        }
    }

    async unlike(req, res){
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

        const postSample = await prisma.postSampleFavourites.delete({
            where: {
                userId_postSampleId: {
                    postSampleId: req.body.id * 1,
                    userId: req.u.BASEID
                }
            }
        });

        if(postSample){
            var likedMovies = await prisma.postSampleFavourites.findMany({
                where: {
                    userId: req.u.BASEID
                },
                select: {
                    postSampleId: true
                }
            })

            if(likedMovies.length > 0){
                const vec = await vf.getVectorForLike(req.u.BASEID);
                await prisma.user.update({
                    where:{
                        id: req.u.BASEID
                    },
                    data:{
                        profile_v: vec
                    }
                })
            }else{
                await prisma.user.update({
                    where:{
                        id: req.u.BASEID
                    },
                    data:{
                        profile_v: []
                    }
                })
            }

            res.json({
                status : 2000,
            })
        }else{
            res.json({
                status : 2002,
            })
        }
    }

    async like(req,res){
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

        const postSample = await prisma.postSample.update({
            where:{
                id : req.body.id * 1
            },
            data:{
                postSampleFavourites:{
                    connectOrCreate: {
                        where: {
                        userId_postSampleId: {
                            userId: req.u.BASEID,
                            postSampleId: req.body.id * 1
                        }
                        },
                        create: {
                            userId: req.u.BASEID,
                        }
                    }
                }
            }
        })

        if(postSample){
            var likedMovies = await prisma.postSampleFavourites.findMany({
                where: {
                    userId: req.u.BASEID
                },
                select: {
                    postSampleId: true
                }
            })

            if(likedMovies.length > 0){
                const vec = await vf.getVectorForLike(req.u.BASEID);
                await prisma.user.update({
                    where:{
                        id: req.u.BASEID
                    },
                    data:{
                        profile_v: vec
                    }
                })
            }else{
                await prisma.user.update({
                    where:{
                        id: req.u.BASEID
                    },
                    data:{
                        profile_v: []
                    }
                })
            }
            
            res.json({
                status : 2000,
            })
        }else{
            res.json({
                status : 2002,
            })
        }
    }

    async doServiceAdmin(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {

                case "SvNew":
                    await this.new(req, res);
                    vf.init();
                    break;

                case "SvMod":
                    await this.mod(req, res);
                    vf.init();
                    break;

                case "SvDel":
                    await this.del(req, res);
                    vf.init();
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

        const postSample = await prisma.postSample.findUnique({
            where: {
                id : req.body.id * 1
            },
            include: {
                comment: {
                    include:{
                        user: true
                    }
                },
                postSampleFavourites: {
                    include: {
                        user: {
                            select:{
                                id: true
                            }
                        }
                    }
                },
                country: {
                    include:{
                        country: true
                    }
                },
                genre: {
                    include:{
                        genre: true
                    }
                },
            }
        });

        if(postSample){
            var c_arr = [];
            for(var c of postSample.country){
                c_arr.push(c.countryId);
            }
            postSample["countryid"] = c_arr;
            var g_arr = [];
            for(var g of postSample.genre){
                g_arr.push(g.genreId);
            }   
            postSample["genreid"]  = g_arr;

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
        const postSampleNewData = PostSampleNewDTO(req);
        
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

        var countryid = postSampleNewData.countryid.map((t)=>t*1);
        var genreid = postSampleNewData.genreid.map((t)=>t*1);

        delete postSampleNewData.countryid;
        delete postSampleNewData.genreid;

        var img = postSampleNewData.img;
        delete postSampleNewData.img;
        
        const newPostSample = await prisma.postSample.create({
            data: {
                ...postSampleNewData
            }
        });

        if(newPostSample.id){  
            var d = Date.now();
            img = await this.saveFile(
                `_films_${newPostSample.id}_${d}_`,
                img.data
            );
            const saveImg = await prisma.postSample.update({
                where: {
                    id : newPostSample.id
                },
                data: {
                    img : img
                }
            });

            await prisma.coutryPostSample.createMany({
                data: countryid.map(c => ({
                    postSampleId: newPostSample.id,
                    countryId: c
                }))
            });

            await prisma.genrePostSample.createMany({
                data: genreid.map(g => ({
                    postSampleId: newPostSample.id,
                    genreId: g
                }))
            });

            if(saveImg.id){
                res.json({
                    status : 2000
                });
            }
        }else{
            res.json({
                status : 2002
            });
        }
    }

    async mod(req, res){
        const postSampleModData = PostSampleUpdateDTO(req);

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

        var countryid = postSampleModData.countryid.map((t)=>t*1);
        var genreid = postSampleModData.genreid.map((t)=>t*1);

        delete postSampleModData.countryid;
        delete postSampleModData.genreid;

        const id = postSampleModData.id
        delete postSampleModData.id

        if(postSampleModData.img.new){
            postSampleModData.img = await this.saveFile(
                `_postSample_image_${id}_`,
                postSampleModData.img.data
            );
        }else{
            delete postSampleModData.img;
        }
        
        const modPostSample = await prisma.postSample.update({
            where : {
                id : id
            },
            data: {
                ...postSampleModData
            }
        });

        if(modPostSample.id){  
            await prisma.genrePostSample.deleteMany({
                where: {
                    postSampleId: id
                }
            });
            await  prisma.countryPostSample.deleteMany({
                where: {
                    postSampleId: id
                }
            });

            await prisma.countryPostSample.createMany({
                data: countryid.map(c => ({
                    postSampleId: id,
                    countryId: c
                }))
            });

            await prisma.genrePostSample.createMany({
                data: genreid.map(g => ({
                    postSampleId: id,
                    genreId: g
                }))
            });

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

        await prisma.postSample.delete({
            where : {
                id : req.body.id * 1
            }
        });

        res.json({
            status : 2000
        });
        
    }
}

module.exports = postSampleModel;