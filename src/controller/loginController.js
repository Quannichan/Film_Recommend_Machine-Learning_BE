const loginModel = require("../models/loginModel")
const {roleMapping} = require("../tools/mapping");
const { LoginDTO } = require("../DTO/auth/LoginDTO");

class loginController{

    async login(req, res){
        try{
            const loginData = LoginDTO(req);
            const userdata = await new loginModel().login(loginData);
            if(userdata){
                if(userdata.role !== null){
                    const token = await new loginModel().createToken(userdata.id, userdata.role);
                    if(token === null){
                        return res.json({"status" : 2001, msg: "Sai thông tin đăng nhập!"})
                    }
                    res.json({"status" : 2000, "userdata" : userdata, "tokenizer" : token, "role" : roleMapping(userdata.role+"")});
                }else{
                    res.json({"status" : 2001, "msg" : "Sai thông tin đăng nhập"})
                }
            }else{
                res.json({"status" : 2001, "msg" : "Sai thông tin đăng nhập!"})
            }
        }catch(error){
            console.log(error)
            res.json({"status" : 2002})
        }
        
    }

    async logout(req, res){
        if(await new loginModel().logout(req)){
            res.json({"status" : 2000})
        }else{
            res.json({"status" : 2002})
        }
    }
}

module.exports = loginController 
