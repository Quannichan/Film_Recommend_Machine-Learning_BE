const Hashtool = require("../security/HashTool")
const tokenModel = require("../models/tokenModel")
const { prisma } = require("../config/connectSql");
class loginModel{

    async login(loginData){
        try{
            const valid_phone = await prisma.user.findUnique(
                {
                    where: {phone   : loginData.email_phone},
                }) || null;
            
            const valid_email = await prisma.user.findUnique(
                {
                    where: {mail    : loginData.email_phone},
                }) || null;

            if(valid_phone){
                if(await new Hashtool().CompareHash(valid_phone.pass, loginData.pass)){
                    return valid_phone;
                }
            }

            if(valid_email){
                if(await new Hashtool().CompareHash(valid_email.pass , loginData.pass)){
                    return valid_email;
                }
            }

            return null;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    async createToken(id, role){
        try{
           return tokenModel.createToken(id, role + "")
        }catch(err){
            console.log(err)
            return null;
        }
    }

    async check(req, roles = null){
        return tokenModel.validate(req, roles);
    }

    async logout(req){
        return true;
    }
}

module.exports = loginModel
