function PostSampleNewDTO(req){
    return {
        name : req.body.name ? req.body.name : null,
        name_en : req.body.name_en ? req.body.name_en : null,
        descript : req.body.descript ? req.body.descript : null,
        countryid : req.body.countryid ? req.body.countryid : null,
        genreid : req.body.genreid ? req.body.genreid : null,
        img : req.body.img ? req.body.img : null,
    }
}

module.exports = {PostSampleNewDTO};