require('dotenv').config();

const { formatDateToSQL, writeFile } = require("../tools/commonTools");
const { prisma } = require("../config/connectSql");
const { ModAvaDTO } = require("../DTO/user/ModAvaDTO");
const { ModDTO } = require("../DTO/user/ModDTO");
const { GetLstPageDTO } = require("../DTO/user/GetLstPageDTO");
const { roleMapping } = require("../tools/mapping");
const { ModPassDTO } = require("../DTO/user/ModPassDTO");
const Hashtool = require("../security/HashTool");
class infoModel{

    async doServicePublicGet(req, res){
        const sv = req.query.sv;
        if(sv){
            switch (sv) {
                case "SvVerify":
                    await this.verify(req, res);
                    break;

                default:
                    res.json({
                        "status" : 2004,
                    })
            }
        }
    }

    async verify(req, res){
        if(req.query.t){
            const tok = JSON.parse(new Hashtool().decodeAES(req.query.t));
            if(tok.id && tok.mail && tok.e){

                const expireDate = new Date(tok.e);
                if (expireDate < new Date()) {
                    return res.redirect(`${process.env.FRONTEND_URL}/verify/account`);
                }

                const u = await prisma.user.findUnique({
                    where : {
                        id : tok.id*1,
                        mail : tok.mail,
                    }
                });

                if(u && u.id){

                    const idu = tok.id;
                    const mail = tok.mail;
                    delete tok.e;
                    const now = new Date();
                    tok.vd = now.getTime();
                    const verifyTok = new Hashtool().encodeAES(JSON.stringify(tok));

                    await prisma.user.update({
                        where : {
                            id : tok.id*1,
                            mail : tok.mail,
                        },
                        data : {
                            emailVerified : true,
                            verifyToken : verifyTok
                        }
                    });
                    return res.redirect(`${process.env.FRONTEND_URL}/verify/account?i=${idu}&m=${mail}&vt=${verifyTok}`);
                }else{
                    return res.redirect(`${process.env.FRONTEND_URL}/verify/account`);
                }
            }else{
                return res.redirect(`${process.env.FRONTEND_URL}/verify/account`);
            }
        }else{
            return res.redirect(`${process.env.FRONTEND_URL}/verify/account`);
        }
    }

    async doServicePubl(req, res){
        const sv = req.body.serv;
        try{
            if(sv){
                switch (sv) {
                    case "SvPage":
                        await this.getLstPage(req, res);
                        break;

                    case "SvCheckVerify":
                        await this.checkVerify(req, res);
                        break;

                    case "SvGet":
                        await this.get(req, res);
                        break;

                    case "SvGetLst":
                        await this.getLst(req, res);
                        break;
                
                    default:
                        res.json({
                            "status" : 2004,
                        })
                        break;
                }
            }else{
                
            }
        }catch(errr){
            console.log(errr);
            res.json({
                "status" : 2005,
            })
        }
    }

    async checkVerify(req, res){
        const {id, mail, verifyToken} = req.body;
        if(id && mail && verifyToken){
            const checkVT = JSON.parse(new Hashtool().decodeAES(verifyToken));
            const u = await prisma.user.findUnique({
                where : {
                    id : id*1,
                    mail : mail
                }
            });

            const qVT = JSON.parse(new Hashtool().decodeAES(u.verifyToken));

            if(checkVT.id*1 == qVT.id*1 && checkVT.mail == qVT.mail && checkVT.vd == qVT.vd){
                res.json({
                    "status" : 2000
                });
            }else{
                res.json({
                    "status" : 2001
                });
            }
        }else{
            res.json({
                "status" : 2001
            });
        }
    }

    async getLst(req, res){
        const search = req.body.search || "";
        const userData = await prisma.user.findMany({
            where : {
                role : 1,
                OR:[
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        mail: {
                            contains: search
                        }
                    }
                ]
            },
            select: {
                id : true,
                name : true,
                ava : true,    
                mail: true,            
            }
        });
        res.json({
            status : 2000,
            data : userData
        });
    }

    async get(req, res){
        if(!req.body.id)
            return res.json({
                "status" : 2001
            });
        
        if(isNaN(req.body.id))
            return res.json({
                "status" : 2001
            });
        
        const id = req.body.id * 1;

        const userData = await prisma.user.findUnique({
            where : {
                id : id
            },
            select: {
                id : true,
                name : true,
                address : true,
                ava : true,
                birthdate: true,
                descript : true,
                facebook: true,
                github: true,
                job: true,
                linked: true,
                mail: true,
                phone: true,
                portfolio: true,
                reddit: true,
                sex: true,
                posts: {
                    where : {
                        SharedPosts: {
                            some : {
                                id : req.u.BASEID
                            }
                        }
                    },
                    select : {
                        img: true,
                        id: true,
                        idSample: true,
                    }
                }
            }
        });

        if(userData){
            userData.role = roleMapping(userData.role+"");
            res.json({
                status : 2000,
                data : userData
            });
        }else{
            res.json({
                status : 2001
            });
        }
    }

    async getLstPage(req, res){
        const UserLstPageData = GetLstPageDTO(req);

        for(var k in UserLstPageData){
            if(UserLstPageData.hasOwnProperty(k)){
                if(UserLstPageData[k] === null || UserLstPageData[k] === "" || UserLstPageData[k] === undefined){
                    delete UserLstPageData[k];
                }
            }
        }

        if(!UserLstPageData.search){
            UserLstPageData.search = ""
        }
        const search = UserLstPageData.search;
        delete UserLstPageData.search;
        const page = UserLstPageData.page;
        delete UserLstPageData.page;
        const skip = (page - 1) * UserLstPageData.size; 
        delete UserLstPageData.page;
        const size = UserLstPageData.size;
        delete UserLstPageData.size;

        if(UserLstPageData.serviceId === 0){
            delete UserLstPageData.serviceId
        }

        const userLstPage = await prisma.user.findMany({
            skip : skip,
            take : size,
            orderBy : {
                id : "desc"
            },
            where : {
                role : 1,
                OR:[
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        mail: {
                            contains: search
                        }
                    }
                ]
            },
            select: {
                id : true,
                name : true,
                ava : true,                
            }
        });

        const total = await prisma.user.count({
            orderBy : {
                id : "desc"
            },
            where : {
                displayName : {
                    contains : search
                },
                ...UserLstPageData,
            },
        })

        const totalPages = Math.ceil(total / size);

        res.json({
            status: 2000,
            data : userLstPage,
            total: totalPages,
            next : page < totalPages ? true : false  
        })
                                
    }

    async doService(req, res){
        const sv = req.body.serv;
        try{
            if(sv){
                switch (sv) {
                    case "SvMod":
                        await this.Mod(req, res);
                        break;

                    case "SvModPass":
                        await this.ModPass(req, res);
                        break;

                    case "SvGetAuth":
                        await this.GetAuth(req, res);
                        break;

                    case "SvModAva":
                        await this.ModAva(req, res);
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
        }catch(errr){
            console.log(errr);
            res.json({
                "status" : 2005,
            })
        }
    }

    async ModPass(req, res){
        const modPass = ModPassDTO(req);

        if(!modPass.id || !modPass.newPass || !modPass.oldPass){
            return res.json({
                "status" : 2001
            });
        }

        if(modPass.id !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        const userData = await prisma.user.findUnique({
            where:{
                id: modPass.id
            }
        })

        if(!await new Hashtool().CompareHash(userData.pass, modPass.oldPass)){
            return res.json({
                "status" : 2003
            });
        }

        modPass.newPass = await new Hashtool().Hash(modPass.newPass);

        const userDataMod = await prisma.user.update({
            where:{
                id: modPass.id
            },
            data : {
                pass : modPass.newPass
            }
        });

        if(userDataMod){
            res.json({
                "status" : 2000
            });
        }else{
            res.json({
                "status" : 2001
            });
        }

    }

    async Mod(req, res){
        const ModData = ModDTO(req);
        if(!ModData.id){
            return res.json({
                "status" : 2001
            });
        }

        if(ModData.id !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        for(var k in ModData){
            if(ModData.hasOwnProperty(k)){
                if(ModData[k] === null || ModData[k] === "" || ModData[k] === undefined){
                    delete ModData[k];
                }
            }
        }

        if(Object.keys(ModData).length === 0){
            return res.json({
                "status" : 2001
            });
        }

        const id = ModData.id
        delete ModData.id;
        const now = new Date();
        const mod = await prisma.user.update({
            where : {
                id: id
            },
            data : {
                date02 : now,
                ...ModData
            }
        });

        if(mod){
            res.json({
                status: 2000,
            });
        }else{
            res.json({
                "status" : 2001
            });
        }
    }

    async GetAuth(req, res){
        const id = req.body.id * 1;
        if(id && id !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }
        const user = await prisma.user.findUnique({
            where : {
                id : id
            },
            include : {
                postSampleFavourites : true
            }
        });
        
        if(user.id === req.u.BASEID){
            delete user.pass;
            res.json({
                "status" : 2000,
                "data" : user
            });
        }else{
            return res.json({
                "status" : 2001
            });
        }
    }

    async ModAva(req, res){
        const ModAvaData = ModAvaDTO(req);
        if(!ModAvaData.id || !ModAvaData.img){
            return res.json({
                "status" : 2001
            });
        }
        if(ModAvaData.id && ModAvaData.id !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        const newFileName = await this.saveFile(`${ModAvaData.id}_${Date.now()}`, ModAvaData.img);

        const now = new Date();

        const update = await prisma.user.update({
            where : {
                id : ModAvaData.id
            },
            data : {
                ava: newFileName,
                date02 : now
            }    
        });

        if(update && update.id === req.u.BASEID){
            delete update.pass;
            res.json({
                "status" : 2000,
                "userdata" : update
            });
        }else{
            return res.json({
                "status" : 2001
            });
        }
    }

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

    async doServiceADM(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                //start sv user for admin



                //end sv user
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
}

module.exports = infoModel