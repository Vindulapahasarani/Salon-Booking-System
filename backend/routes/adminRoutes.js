const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/stats', verifyToken, verifyAdmin, adminController.getAdminStats);

module.exports = router;
