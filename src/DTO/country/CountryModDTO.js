
function CountryModDTO(req){
    return{
        id         : req.body.id ? req.body.id * 1 : null,
        name       : req.body.name ? req.body.name : "",
        slug        : req.body.slug ? req.body.slug : "",
        code        : req.body.code ? req.body.code : "",
    }
}

module.exports = {CountryModDTO}