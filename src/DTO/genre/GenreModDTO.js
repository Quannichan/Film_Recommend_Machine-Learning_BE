
function GenreModDTO(req){
    return{
        id         : req.body.id ? req.body.id * 1 : null,
        name       : req.body.name ? req.body.name : "",
    }
}

module.exports = {GenreModDTO}