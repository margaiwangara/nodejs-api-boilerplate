const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// dotenv config
dotenv.config({ path: `${__dirname}/../config/config.env` });

// send email function
const sendEmail = async (options) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    // email information spread
    // console.log(options);
    const info = await transporter.sendMail(options);

    console.log(`Message sent. Id: ${info.messageId}`);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
