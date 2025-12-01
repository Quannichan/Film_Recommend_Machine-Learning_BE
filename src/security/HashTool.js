const argon = require("argon2");
const crypto = require('crypto');
require('dotenv').config()

class Hashtool{

    async Hash(pass){
        return await argon.hash(pass);
    }

    async CompareHash(haspass ,pass){
        return await argon.verify(haspass, pass);
    }

    encodeAES(text){
        const rawSecret = process.env.KEY;
        const key = crypto.createHash('sha256').update(rawSecret).digest();
        const iv = Buffer.from("e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8", 'hex');
        const algorithm = 'aes-256-cbc';
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted
    }

    decodeAES(encrypted) {
        try{
            console.log(encrypted);
            const rawSecret = process.env.KEY;
            const key = crypto.createHash('sha256').update(rawSecret).digest();
            const iv = "e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8";
            const algorithm = 'aes-256-cbc';
            if(encrypted === undefined || encrypted === null || encrypted === ""){
                return null;
            }
            const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }catch(e){
            console.log(e);
        }
    }

}

module.exports = Hashtool;