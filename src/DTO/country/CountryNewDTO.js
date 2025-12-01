
function CountryNewDTO(req){
    return{
        name        : req.body.name ? req.body.name : "",
        slug        : req.body.slug ? req.body.slug : "",
        code        : req.body.code ? req.body.code : "",
    }
}

module.exports = {CountryNewDTO}