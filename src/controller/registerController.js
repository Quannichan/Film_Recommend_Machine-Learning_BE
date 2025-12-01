const { RegisterDTO } = require("../DTO/auth/RegisterDTO")
const loginModel = require("../models/loginModel")
const registerModel = require("../models/registerModel")
const Hashtool = require("../security/HashTool")
const sendmail = require("../tools/mail")
const { roleMapping } = require("../tools/mapping")

class registerController{

    async register(req, res){
        try{
            const registerData = RegisterDTO(req);
            if(!await new registerModel().checkExist(registerData)){
                registerData.pass = await new Hashtool().Hash(registerData.pass);
                const data = await new registerModel().register(registerData, res);
                if(data){
                    // const token = await new loginModel().createToken(data.id, data.role);
                    // delete data.pass;
                    // res.json({"status" : 2000, "userdata" : data, "tokenizer" : token, "role" : roleMapping(data.role+"")})

                    await sendmail.sendMail(data.mail, data.id, data.name, 30)
                    .then((data)=>{
                        if(data){
                            res.json({"status" : 2000})
                        }else{
                            res.json({"status" : 2001})
                        }
                    })
                    .catch((e)=>{
                        res.json({"status" : 2005})
                    })

                }else{
                    res.json({
                        "status"  : 2002,
                    });
                }
            }else{
                res.json({
                    "status"  : 2001,
                    "msg"     : "Tài khoản đã tồn tại!"
                });
            }
        }catch(error){
            res.json({"status" : 2002})
            console.log(error)
        }
    }

}

module.exports = registerController