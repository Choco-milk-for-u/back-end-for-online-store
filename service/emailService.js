const eTransport = require('nodemailer');
const ApiError = require('../error/ApiError');

class EmailService {
    constructor() {
        const ghost = process.env.HOST_EMAIL;
        const gport = process.env.HOST_PORT;

        this.transporter = eTransport.createTransport({
            service:"gmail",
            host: ghost,
            port: gport,
            secure:false,
            tls: { rejectUnauthorized: false },
            auth: {
                user: process.env.EMAIL_SMPT,
                pass: process.env.EMAIL_PASSWORD,
            }
        })
    }
    sendEmail = async(to, link)=>{
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_SMPT,
                to,
                subject: 'Activation link',
                text: 'Pls read instraction',
                html: `<h3>${link}</h3><p>Click at this link or paste it with us addres and dont forget about / before link</p><hr></hr><a href=${link}>${link}</a>`
            })
        } catch (error) {
            throw ApiError.badRequest('somthink wrong with send email');
        }

    }
}

module.exports = new EmailService();