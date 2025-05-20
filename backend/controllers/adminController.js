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

// Get all appointments for admin (with user and service info)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('serviceId', 'name price');

    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAllAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// Get appointments by date
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    // Parse the date string (yyyy-MM-dd) and set time to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('serviceId', 'name price');

    if (!appointments.length) {
      return res.status(200).json([]); // Return empty array if no appointments found
    }

    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByDate error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments for the specified date." });
  }
};

// Get appointment counts by month
exports.getAppointmentsByMonth = async (req, res) => {
  try {
    const { month } = req.params; // Format: yyyy-MM
    const startOfMonth = new Date(`${month}-01`);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).select('date');

    const counts = appointments.reduce((acc, appt) => {
      const day = new Date(appt.date).getDate();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(counts);
  } catch (err) {
    console.error("❌ getAppointmentsByMonth error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointment counts for the specified month." });
  }
};

// Update appointment status (approve/reject) or delete
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Received request to update/delete appointment with ID: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error(`Invalid Appointment ID format: ${id}`);
      return res.status(400).json({ message: "Invalid Appointment ID format." });
    }

    if (req.method === 'DELETE') {
      console.log(`Deleting appointment with ID: ${id}`);
      const appointment = await Appointment.findByIdAndDelete(id);
      if (!appointment) {
        console.error(`Appointment not found: ${id}`);
        return res.status(404).json({ message: "Appointment not found" });
      }
      return res.status(200).json({ message: "Appointment deleted successfully" });
    }

    console.log(`Updating appointment with ID: ${id} to status: ${status}`);
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      console.error(`Appointment not found: ${id}`);
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status && ['confirmed', 'cancelled', 'completed', 'pending'].includes(status)) {
      appointment.status = status;
      await appointment.save();
      console.log(`Appointment ${id} updated to status: ${status}`);
      res.status(200).json({ message: `Appointment ${status}` });
    } else {
      console.error(`Invalid status value: ${status}`);
      res.status(400).json({ message: "Invalid status value." });
    }
  } catch (err) {
    console.error("❌ updateAppointmentStatus error:", err.stack);
    res.status(500).json({ message: "Failed to update appointment status.", error: err.message });
  }
};