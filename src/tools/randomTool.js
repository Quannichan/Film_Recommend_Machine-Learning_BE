const hash = require("../security/HashTool");
const {roleMapping} = require("./mapping");

function createToken(id, role){
    const r = roleMapping(role);
    if(r === null){
        return null;
    }
    const tok = {
        id: id,
        role: roleMapping(role)
    }
    const h = new hash().encodeAES(JSON.stringify(tok));
    return h;
}


module.exports.createToken = createToken
