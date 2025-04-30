const Appointment = require("../models/Appointment");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    if (!req.user || !req.user.id || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized: user info missing" });
    }

    const { serviceId, serviceName, timeSlot, price } = req.body;

    if (!serviceId || !serviceName || !timeSlot || !price) {
      return res.status(400).json({ message: "Missing required appointment fields." });
    }

    const appointment = new Appointment({
      userId: req.user.id,
      userEmail: req.user.email,
      serviceId,
      serviceName,
      timeSlot, // e.g., "2024-04-29 14:00"
      price,
      status: "pending",
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error("createAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to create appointment." });
  }
};

// Get all appointments for logged-in user
exports.getMyAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("getMyAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch your appointments." });
  }
};

// Get all appointments (Admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("getAllAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// Get appointments by email
exports.getAppointmentsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const appointments = await Appointment.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("getAppointmentsByEmail error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments by email." });
  }
};

// Update (reschedule) appointment
exports.updateAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment updated successfully!", appointment: updatedAppointment });
  } catch (err) {
    console.error("updateAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to update appointment." });
  }
};

// Approve an appointment (Admin only)
exports.approveAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "approved" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment approved successfully!", appointment: updatedAppointment });
  } catch (err) {
    console.error("approveAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to approve appointment." });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    console.error("deleteAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};
