require('dotenv').config();
const Hashtool = require('../security/HashTool');
const { verifyEmailTemplate } = require("../utils/verifyEmailTemplate");

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.SMTP_PASS
    }
});

class Mail{
    async sendMail(toEmail, iduser, name, minutes) {
        return new Promise((resolve, reject)=>{

            const now = new Date();
            const expire = new Date(now.getTime() + minutes * 60 * 1000);
            const tok = new Hashtool().encodeAES(JSON.stringify(
                {
                    id: iduser*1,
                    mail : toEmail,
                    e : expire
                }
            ))

            const message = verifyEmailTemplate(`${process.env.MAIL_VERIFY_URL}?t=${tok}&sv=SvVerify`, name, minutes)

            const mailOptions = {
                from: process.env.MAIL_FROM,
                to: toEmail,                
                subject: 'Verify your account!',
                html: message
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error:', error);
                    reject(false);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            });
        })
    }
}

const sendmail = new Mail();

module.exports = sendmail;