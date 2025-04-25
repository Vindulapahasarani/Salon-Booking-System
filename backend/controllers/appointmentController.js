const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, userEmail } = req.body;
    const userId = req.user?.userId;

    if (!userId || !serviceId || !date || !timeSlot || !userEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAppointment = new Appointment({
      userId,
      serviceId,
      userEmail,
      date,
      timeSlot,
      status: "pending",
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ message: "Server error while creating appointment" });
  }
};

// Get all appointments for a user by email
const getAppointmentsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const appointments = await Appointment.find({ userEmail: email }).populate("serviceId");

    const mapped = appointments.map((appt) => ({
      _id: appt._id,
      serviceName: appt.serviceId?.name,
      price: appt.serviceId?.price,
      duration: appt.serviceId?.duration,
      time: appt.timeSlot,
      date: appt.date,
      status: appt.status,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Fetch appointments error:", error);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

// Update (reschedule) appointment
const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { date, timeSlot } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date, timeSlot, status: "pending" },
      { new: true }
    ).populate("serviceId");

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({
      message: "Appointment updated successfully",
      updated: {
        _id: updated._id,
        serviceName: updated.serviceId?.name,
        price: updated.serviceId?.price,
        duration: updated.serviceId?.duration,
        time: updated.timeSlot,
        date: updated.date,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Server error while updating appointment" });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const deleted = await Appointment.findByIdAndDelete(appointmentId);

    if (!deleted) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({ message: "Server error while deleting appointment" });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointment,
  deleteAppointment,
};
