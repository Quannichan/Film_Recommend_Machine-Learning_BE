function PostSamplePageDTO(req){
    return{
        search: req.body.search ? req.body.search : "",
        page : req.body.page ? req.body.page * 1 : 1,
        size : req.body.size ? req.body.size * 1 : 8,
        genreid: req.body.genreid? req.body.genreid*1 : null,
        countryid: req.body.countryid? req.body.countryid*1 : null,
    };
};

module.exports = {PostSamplePageDTO};