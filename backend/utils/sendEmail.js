const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API Key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL, // ✅ Make sure this is verified
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
