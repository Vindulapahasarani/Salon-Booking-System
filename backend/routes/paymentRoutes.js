const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

router.post('/create-checkout-session', verifyToken, createCheckoutSession);

module.exports = router;
