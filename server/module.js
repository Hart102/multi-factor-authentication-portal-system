require('dotenv').config();
const nodemailer = require('nodemailer')

const sendMail = () => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'goodluckhart340',
            pass: 'mhebhgdrisoonlvl'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    return mailTransporter
}

module.exports = { 
    sendMail
}


// user: goodluckhart340
// pass: 'mhebhgdrisoonlvl'