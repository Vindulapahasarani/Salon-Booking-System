const Appointment = require('../models/Appointment');
const User = require('../models/User');
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
