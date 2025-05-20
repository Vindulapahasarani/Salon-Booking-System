const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get admin dashboard stats
router.get('/stats', verifyToken, verifyAdmin, adminController.getAdminStats);

// Get all appointments
router.get('/appointments', verifyToken, verifyAdmin, adminController.getAllAppointments);

// Get appointments by date
router.get('/appointments/date/:date', verifyToken, verifyAdmin, adminController.getAppointmentsByDate);

// Get appointment counts by month
router.get('/appointments/month/:month', verifyToken, verifyAdmin, adminController.getAppointmentsByMonth);

// Update or delete appointment status
router.patch('/appointments/:id', verifyToken, verifyAdmin, adminController.updateAppointmentStatus);
router.delete('/appointments/:id', verifyToken, verifyAdmin, adminController.updateAppointmentStatus);

module.exports = router;