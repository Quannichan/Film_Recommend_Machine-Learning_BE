const Hashtool = require("../security/HashTool");
const randomTool    = require("../tools/randomTool")

class tokenModel{

    constructor(){
        this.USERS_TOK   = [];
    }

    createToken(id, role){
        return randomTool.createToken(id, role);
    }

    validate(req, roles){
        try{
            var hashtok = new Hashtool().decodeAES(req.get("tokenizer"));
            if(hashtok === null){
                return false;
            }
            var tok = JSON.parse(hashtok);
            if(roles.includes(tok.role)){
                console.log("validate " + true);
                return {
                    valid: true,
                    r : tok.role,
                    i : tok.id
                };
            }

            return {
                valid: false,
            };
        }catch(e){
            console.log(e);
            return {
                valid: false,
            };
        }   
    }

    // validateSUPADM(tok){
    //     tok = JSON.parse(new Hashtool().decodeAES(tok));
    //     if(tok === null){
    //         return false;
    //     }
    //     if(tok.role === "SUPADM"){
    //         console.log("validate SUPADM" + true)
    //         return true;
    //     }
    //     return false;
    // }
}

const tokenContrl = new tokenModel();
module.exports = tokenContrl;