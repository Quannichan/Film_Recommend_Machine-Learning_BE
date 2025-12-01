function LoginDTO(req) {
  return {
    email_phone: req.body.email_phone,
    pass: req.body.pass,
  };
}

module.exports = {LoginDTO}