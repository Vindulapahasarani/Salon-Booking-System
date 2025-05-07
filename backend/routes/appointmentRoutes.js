const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentsByEmail,
  updateAppointment,
  approveAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const verifyToken = require("../middleware/verifyToken");

const verifyAdmin = require("../middleware/verifyAdmin");

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post("/", verifyToken, createAppointment);

// @route   GET /api/appointments/my
// @desc    Get logged-in user's appointments
// @access  Private
router.get("/my", verifyToken, getMyAppointments);

// @route   GET /api/appointments
// @desc    Get all appointments (admin only)
// @access  Admin
router.get("/", verifyToken, verifyAdmin, getAllAppointments);

// @route   GET /api/appointments/email/:email
// @desc    Get appointments by email (admin lookup or personal view)
// @access  Private
router.get("/email/:email", verifyToken, getAppointmentsByEmail);

// @route   PUT /api/appointments/:id
// @desc    Update (reschedule) an appointment
// @access  Private
router.put("/:id", verifyToken, updateAppointment);

// @route   PUT /api/appointments/:id/approve
// @desc    Approve an appointment (admin only)
// @access  Admin
router.put("/:id/approve", verifyToken, verifyAdmin, approveAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete("/:id", verifyToken, deleteAppointment);

module.exports = router;
