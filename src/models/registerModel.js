const {writeFile} = require("../tools/commonTools")
const { prisma } = require("../config/connectSql");

class registerModel{

    async register(registerData, res){ 
        try{
            const u = await prisma.user.create({
                data:{
                    role            : 1,
                    ava             : 'defaultimg.jpg',
                    sex             : 0,
                    mail            : registerData.mail,
                    name            : registerData.name,
                    pass            : registerData.pass,
                    phone           : registerData.phone,
                }
            })
            delete u.pass;
            return u;
        }catch(error){
            console.log(error)
            return null;
        }
        
    }

    async dobuildAva(name, d, save_path){
        return new Promise(async (resolve, reject)=>{
            const matches = d.match(/^data:(image\/\w+);base64,(.+)$/);
            const ext = matches[1].split('/')[1];
            const data = matches[2];
            const name_file = `${name}-image.${ext}`;
            console.log(name_file);
            await writeFile(name_file, data, save_path)
            .then(()=>{
                resolve(`${name_file}`);
            })
            .catch((err)=>{
                console.log(err);
                reject(null);
            })
        })
    }

    async checkExist(registerData){
        try{
            const valid_phone = await prisma.user.findUnique(
                {
                    where: {phone   : registerData.phone},
                }) || null;
            
            const valid_email = await prisma.user.findUnique(
                {
                    where: {mail    : registerData.mail},
                }) || null;

            if(valid_phone){
                return true;
            }

            if(valid_email){
                return true;
            }

            return false;
        }catch(error){
            console.log(error);
            return true;
        }
    }

}

module.exports = registerModel