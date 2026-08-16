function PostSampleUpdateDTO(req){
    return {
        id : req.body.id ? req.body.id * 1 : null,
        name : req.body.name ? req.body.name : null,
        name_en : req.body.name_en ? req.body.name_en : null,
        descript : req.body.descript ? req.body.descript : null,
        countryid : req.body.countryid ? req.body.countryid : null,
        genreid : req.body.genreid ? req.body.genreid : null,
        img : req.body.img ? req.body.img : null,
        film : req.body.film ? req.body.film : null,
    }
}

module.exports = {PostSampleUpdateDTO};