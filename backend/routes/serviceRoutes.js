const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const verifyToken = require("../middleware/authMiddleware");

// Create service (protected)
router.post("/", verifyToken, serviceController.createService);

// Get all services (public)
router.get("/", serviceController.getServices);

router.get("/:id", serviceController.getServiceById);


// Update service (protected)
router.put("/:id", verifyToken, serviceController.updateService);

// Delete service (protected)
router.delete("/:id", verifyToken, serviceController.deleteService);

module.exports = router;
