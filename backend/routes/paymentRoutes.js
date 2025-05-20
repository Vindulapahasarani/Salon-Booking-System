const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

// Get all unpaid appointments for the logged-in user
router.get('/appointments/unpaid', verifyToken, paymentController.getUnpaidAppointments);

// Process cash payment
router.post('/payments/cash', verifyToken, paymentController.processCashPayment);

// Create Stripe checkout session
router.post('/payments/stripe/checkout', verifyToken, paymentController.createCheckoutSession);

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;