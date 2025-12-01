function ModPassDTO(req){
    return{
        id : req.body.id ? req.body.id * 1 : null,
        oldPass : req.body.oldPass ? req.body.oldPass : null,
        newPass : req.body.newPass ? req.body.newPass : null,
    }
}

module.exports = {ModPassDTO};