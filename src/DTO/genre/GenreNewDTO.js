
function GenreNewDTO(req){
    return{
        name        : req.body.name ? req.body.name : "",
    }
}

module.exports = {GenreNewDTO}