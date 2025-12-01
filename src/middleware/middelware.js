const { prisma } = require("../config/connectSql");
const loginModel = require("../models/loginModel");
const Hashtool = require("../security/HashTool");
const { roleMappingRaw } = require("../tools/mapping");

class middelware{

    checkRole(roles){
        return async (req, res, next)=>{
            try{
                if(roles === undefined || roles === null || roles.length === 0){
                    const tok_ = req.get("tokenizer");
                    if(tok_ !== 'null' && tok_ !== null && tok_ !== undefined){
                        try{
                            var hashtok = new Hashtool().decodeAES(req.get("tokenizer"));
                            if(hashtok === null){
                                next();
                            }else{
                                const tok = JSON.parse(hashtok);
                                if(!tok.role || !tok.id){
                                    return res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"});
                                }else{
                                    const c = await prisma.user.count({
                                        where: {
                                            id: tok.id*1,
                                            role : roleMappingRaw(tok.role)
                                        }
                                    });

                                    if(c === 0)
                                        return res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"});

                                    if(tok.role === "SUPADM"){
                                        req.u = {
                                            BASEROLE : tok.role,
                                            BASEID : tok.id
                                        };
                                        next();
                                    }else{
                                        req.u = {
                                            BASEROLE : tok.role,
                                            BASEID : tok.id
                                        };
                                        next();
                                    }
                                }
                            }
                        }catch(e){
                            next();
                        }
                    }else{
                        next();
                    }
                }else{
                    const stat = await new loginModel().check(req, roles);
                    if(stat.valid){
                        const r = roleMappingRaw(stat.r);
                        const c = await prisma.user.count({
                            where: {
                                id: stat.i*1,
                                role : r
                            }
                        });

                        if(c === 0)
                            return res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"});
                        
                        req.u = {
                            BASEROLE : stat.r,
                            BASEID : stat.i
                        }
                        next();
                    }else{
                        res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"});
                    }
                }
            }catch(err){
                console.log(err)
                res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"})
            }
        }
    }

    checklogin(roles){
        return async (req, res)=>{
            try{
                if(await new loginModel().check(req, roles)){
                    res.json({"status" : 2000})
                }else{
                    res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"})
                }
            }catch(err){
                console.log(err)
                res.json({"status" : 2004, "msg": "YOU NOT HAVE ANY PERMISSION!"})
            }
        }
    }
}

const mw = new middelware();
module.exports = mw