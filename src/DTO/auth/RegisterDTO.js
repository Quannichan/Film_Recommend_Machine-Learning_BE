function RegisterDTO(req) {
  return {
    name        : req.body.name,
    phone       : req.body.phone,
    mail        : req.body.mail,
    pass        : req.body.pass,
  };
}

module.exports = {RegisterDTO}