function GetLstPageDTO(req){
    return{
        page            : req.body.page ? req.body.page * 1 : 1,
        size            : req.body.size ? req.body.size * 1 : 8,
        search          : req.body.search || "",
        city            : req.body.city ? req.body.city : null,
        serviceId       : req.body.typ01 ? req.body.typ01 * 1 : 0
    }
}

module.exports = {GetLstPageDTO};