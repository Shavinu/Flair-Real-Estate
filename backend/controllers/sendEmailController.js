// email handler
const nodemailer = require('nodemailer');

module.exports = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_HOST,
      service: process.env.AUTH_SERVICE,
      port: Number(process.env.AUTH_EMAIL_PORT),
      secure: Boolean(process.env.AUTH_SECURE),
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: subject,
      html: html,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.log('Email not sent');
    console.log(error);
  }
};
