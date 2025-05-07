const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const verifyToken = require("../middleware/verifyToken");

// Public routes
router.get("/", serviceController.getServices); // List all services
router.get("/:id", serviceController.getServiceById); // Get single service

// Protected routes (admin or authenticated user)
router.post("/", verifyToken, serviceController.createService); // Create
router.put("/:id", verifyToken, serviceController.updateService); // Update
router.delete("/:id", verifyToken, serviceController.deleteService); // Delete

module.exports = router;
