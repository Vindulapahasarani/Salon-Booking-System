const Appointment = require('../models/Appointment');
const User = require('../models/user');
const Service = require('../models/Service');

// Admin dashboard stats: total users, services, appointments
exports.getAdminStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();

    res.status(200).json({
      totalAppointments,
      totalUsers,
      totalServices,
    });
  } catch (err) {
    console.error("❌ getAdminStats error:", err.stack);
    res.status(500).json({ message: "Failed to fetch admin stats." });
  }
};

// Get all appointments for admin (with user and service info)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('service', 'name price');

    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAllAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// Update appointment status (approve/reject)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: `Appointment ${status}` });
  } catch (err) {
    console.error("❌ updateAppointmentStatus error:", err.stack);
    res.status(500).json({ message: "Failed to update appointment status." });
  }
};
