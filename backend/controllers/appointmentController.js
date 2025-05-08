const Appointment = require("../models/Appointment");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    if (!req.user?.userId || !req.user?.email) {
      return res.status(401).json({ message: "Unauthorized: user info missing" });
    }

    const { serviceId, serviceName, date, timeSlot, price } = req.body;

    if (!serviceId || !serviceName || !date || !timeSlot || !price) {
      return res.status(400).json({ message: "Missing required appointment fields." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const conflict = await Appointment.findOne({ serviceId, date: parsedDate, timeSlot });
    if (conflict) {
      return res.status(409).json({ message: "This time slot is already booked." });
    }

    const appointment = new Appointment({
      userId: req.user.userId,
      userEmail: req.user.email,
      serviceId,
      serviceName,
      date: parsedDate,
      timeSlot,
      price,
      status: "pending",
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ createAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to create appointment." });
  }
};

// Get all appointments for the logged-in user
exports.getMyAppointments = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appointments = await Appointment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getMyAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch your appointments." });
  }
};

// Admin: Get all appointments, optionally filter by date
exports.getAllAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("serviceId", "name");

    const formatted = appointments.map((appt) => ({
      _id: appt._id,
      userName: appt.userId?.name || "Unknown",
      userEmail: appt.userId?.email || appt.userEmail || "Unknown",
      serviceName: appt.serviceName || appt.serviceId?.name || "N/A",
      date: appt.date.toISOString().split("T")[0],
      timeSlot: appt.timeSlot,
      price: appt.price,
      status: appt.status,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ getAllAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// Get appointments by user email
exports.getAppointmentsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const appointments = await Appointment.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByEmail error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments by email." });
  }
};

// Update/reschedule appointment
exports.updateAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  try {
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (req.user.userId !== appt.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: You cannot update this appointment." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Appointment updated successfully!", appointment: updatedAppointment });
  } catch (err) {
    console.error("❌ updateAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to update appointment." });
  }
};

// Admin: Approve an appointment
exports.approveAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  try {
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

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
    console.error("❌ approveAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to approve appointment." });
  }
};

// Delete an appointment (User or Admin)
exports.deleteAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  try {
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Check if user is authorized
    const isOwner = req.user.userId === appt.userId.toString();
    const isAdmin = req.user.isAdmin;

    // Enforce 24-hour cancellation rule for regular users
    const now = new Date();
    const appointmentDateTime = new Date(appt.date);
    const [hours, minutes] = appt.timeSlot.split(":").map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (!isAdmin && isOwner && hoursDiff < 24) {
      return res.status(403).json({
        message: "You can only cancel appointments at least 24 hours in advance.",
      });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: You cannot delete this appointment." });
    }

    await appt.deleteOne();
    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    console.error("❌ deleteAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};
