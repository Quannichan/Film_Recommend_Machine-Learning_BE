function ModAvaDTO(req){
    return{
        id  : req.body.id ? req.body.id * 1 : 0,
        img : req.body.img
    };
};

module.exports = {ModAvaDTO};