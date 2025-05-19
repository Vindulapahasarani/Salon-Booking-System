const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

// Create Stripe checkout session
router.post('/stripe/checkout', verifyToken, paymentController.createCheckoutSession);

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;