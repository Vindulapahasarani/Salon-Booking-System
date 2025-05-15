const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe Checkout session
// @access  Public (or use auth middleware if needed)
router.post('/create-checkout-session', paymentController.createCheckoutSession);

module.exports = router;
