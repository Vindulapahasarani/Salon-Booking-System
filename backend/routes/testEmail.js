// routes/testEmail.js

const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail'); // adjust path if needed

router.get('/send-test-email', async (req, res) => {
  try {
    await sendEmail(
        'vinpahasaranicom96@gmail.com',
        '📅 Salon Booking System – Confirm Test Email',
        'This is a plain text backup of the HTML content.',
        `
          <div style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #4CAF50;">Salon Booking Confirmation</h2>
  <p>Hi there! 👋</p>
  <p>Your appointment has been successfully confirmed.</p>
  <p>Thank you for using Salon Booking System! 💇‍♀️</p>
</div>

        `
      );

    res.status(200).json({ message: '✅ Test email sent!' });
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({ message: '❌ Failed to send test email' });
  }
});

module.exports = router; // ✅ Must export the router!
