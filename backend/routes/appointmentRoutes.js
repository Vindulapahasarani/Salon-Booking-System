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
  getAppointmentsByDate,     // ✅ new route for calendar view
  getAppointmentsByMonth,    // ✅ new route for visual indicators
  cancelAppointment,         // ✅ optional separate cancel handler (w/ 24hr check)
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
// @desc    Get appointments by user email
// @access  Private
router.get("/email/:email", verifyToken, getAppointmentsByEmail);

// @route   PUT /api/appointments/:id
// @desc    Update or reschedule an appointment
// @access  Private
router.put("/:id", verifyToken, updateAppointment);

// @route   PUT /api/appointments/:id/approve
// @desc    Approve an appointment (admin only)
// @access  Admin
router.put("/:id/approve", verifyToken, verifyAdmin, approveAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancel (delete) an appointment
// @access  Private
router.delete("/:id", verifyToken, deleteAppointment);

// @route   GET /api/appointments/date/:date
// @desc    Get appointments for a specific date (admin calendar)
// @access  Admin
router.get("/date/:date", verifyToken, verifyAdmin, getAppointmentsByDate);

// @route   GET /api/appointments/month/:month
// @desc    Get appointment counts for a given month (calendar indicators)
// @access  Admin
router.get("/month/:month", verifyToken, verifyAdmin, getAppointmentsByMonth);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment with 24hr rule (optional alternative to DELETE)
// @access  Private
router.put("/:id/cancel", verifyToken, cancelAppointment);

module.exports = router;
