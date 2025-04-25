const Service = require("../models/Service");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json({ message: "Service created", service: newService });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update service
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service updated", service: updated });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted", service: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
