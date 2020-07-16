const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// dotenv config
dotenv.config({ path: `${__dirname}/../config/config.env` });

// send email function
const sendEmail = async (options) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // email information spread
    console.log(options);
    const info = await transporter.sendMail(options);

    console.log(`Message sent. Id: ${info.messageId}`);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
