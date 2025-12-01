function ModDTO(req){
    return{
        id              : req.body.id ? req.body.id * 1 : 0,
        name            : req.body.name ? req.body.name : null,
        sex             : req.body.sex ? req.body.sex * 1 : 0,
        descript        : req.body.descript ? req.body.descript : null,
    };
}

module.exports = {ModDTO};