const Service = require("../models/Service");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price == null) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newService = new Service({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
    });

    await newService.save();
    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (err) {
    console.error("❌ Error in createService:", err.stack);
    res.status(500).json({ message: "Failed to create service", error: err.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (err) {
    console.error("❌ Error in getServices:", err.stack);
    res.status(500).json({ message: "Failed to fetch services", error: err.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (err) {
    console.error("❌ Error in getServiceById:", err.stack);
    res.status(500).json({ message: "Failed to fetch service", error: err.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        description: description?.trim(),
        price: parseFloat(price),
      },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (err) {
    console.error("❌ Error in updateService:", err.stack);
    res.status(500).json({ message: "Failed to update service", error: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully", service: deleted });
  } catch (err) {
    console.error("❌ Error in deleteService:", err.stack);
    res.status(500).json({ message: "Failed to delete service", error: err.message });
  }
};
