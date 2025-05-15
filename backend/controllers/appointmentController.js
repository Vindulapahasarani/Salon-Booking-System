const Appointment = require("../models/Appointment");

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { serviceId, serviceName, date, timeSlot, price, paymentMethod } = req.body;

    if (!userId || !email) {
      return res.status(401).json({ message: "Unauthorized: User info missing." });
    }

    if (!serviceId || !serviceName || !date || !timeSlot || !price || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required." });
    }

   const parsedDate = new Date(date);
parsedDate.setHours(0, 0, 0, 0); // ✅ Normalize to start of day

    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const conflict = await Appointment.findOne({ serviceId, date: parsedDate, timeSlot });
    if (conflict) {
      return res.status(409).json({ message: "This time slot is already booked." });
    }

    const newAppointment = new Appointment({
      userId,
      userEmail: email,
      serviceId,
      serviceName,
      date: parsedDate,
      timeSlot,
      price,
      paymentMethod,
      status: "pending",
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("❌ createAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to create appointment." });
  }
};

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const { userId } = req.user;
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getMyAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch your appointments." });
  }
};

// @desc    Admin: Get all appointments (optionally filtered by date)
// @route   GET /api/appointments
// @access  Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) return res.status(400).json({ message: "Invalid date format." });

      const start = new Date(parsedDate.setHours(0, 0, 0, 0));
      const end = new Date(parsedDate.setHours(23, 59, 59, 999));
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
      paymentMethod: appt.paymentMethod || "N/A",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ getAllAppointments error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// @desc    Get appointments by user email
// @route   GET /api/appointments/email/:email
// @access  Admin
exports.getAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await Appointment.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByEmail error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments by email." });
  }
};

// @desc    Update/reschedule an appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { userId, isAdmin } = req.user;

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: "Appointment not found." });

    if (userId !== appt.userId.toString() && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Cannot update this appointment." });
    }

    const updated = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });
    res.status(200).json({ message: "Appointment updated successfully!", appointment: updated });
  } catch (err) {
    console.error("❌ updateAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to update appointment." });
  }
};

// @desc    Approve an appointment
// @route   PUT /api/appointments/:id/approve
// @access  Admin
exports.approveAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "approved" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Appointment not found." });
    res.status(200).json({ message: "Appointment approved!", appointment: updated });
  } catch (err) {
    console.error("❌ approveAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to approve appointment." });
  }
};

// @desc    Delete appointment (with 24hr rule)
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { userId, isAdmin } = req.user;

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: "Appointment not found." });

    const isOwner = userId === appt.userId.toString();

    const now = new Date();
    const appointmentDateTime = new Date(appt.date);
    const [hour, minute] = appt.timeSlot.split(":").map(Number);
    appointmentDateTime.setHours(hour, minute, 0, 0);

    const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60);
    if (!isAdmin && isOwner && hoursDiff < 24) {
      return res.status(403).json({
        message: "You can only cancel appointments at least 24 hours in advance.",
      });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Cannot delete this appointment." });
    }

    await appt.deleteOne();
    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    console.error("❌ deleteAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};

// @desc    Cancel appointment (PUT alternative) with 24hr rule
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { userId, isAdmin } = req.user;

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: "Appointment not found." });

    const isOwner = userId === appt.userId.toString();

    const now = new Date();
    const appointmentDateTime = new Date(appt.date);
    const [hour, minute] = appt.timeSlot.split(":").map(Number);
    appointmentDateTime.setHours(hour, minute, 0, 0);

    const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60);
    if (!isAdmin && isOwner && hoursDiff < 24) {
      return res.status(403).json({
        message: "You can only cancel appointments at least 24 hours in advance.",
      });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Cannot cancel this appointment." });
    }

    appt.status = "cancelled";
    await appt.save();

    res.status(200).json({ message: "Appointment cancelled successfully!" });
  } catch (err) {
    console.error("❌ cancelAppointment error:", err.stack);
    res.status(500).json({ message: "Failed to cancel appointment." });
  }
};

// @desc    Get appointments by specific date (for calendar view)
// @route   GET /api/appointments/date/:date
// @access  Admin
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const parsed = new Date(date);
    if (isNaN(parsed)) return res.status(400).json({ message: "Invalid date format." });

    const start = new Date(parsed.setHours(0, 0, 0, 0));
    const end = new Date(parsed.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({ date: { $gte: start, $lte: end } }).sort({ timeSlot: 1 });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByDate error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments by date." });
  }
};

// @desc    Get appointment counts per day in a month (for calendar dots)
// @route   GET /api/appointments/month/:month
// @access  Admin
exports.getAppointmentsByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const parsed = new Date(month);
    if (isNaN(parsed)) return res.status(400).json({ message: "Invalid month format." });

    const year = parsed.getFullYear();
    const monthIndex = parsed.getMonth();

    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const results = await Appointment.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          count: { $sum: 1 },
        },
      },
    ]);

    const countsByDay = {};
    results.forEach((item) => {
      countsByDay[item._id] = item.count;
    });

    res.status(200).json(countsByDay);
  } catch (err) {
    console.error("❌ getAppointmentsByMonth error:", err.stack);
    res.status(500).json({ message: "Failed to fetch appointments by month." });
  }
};
