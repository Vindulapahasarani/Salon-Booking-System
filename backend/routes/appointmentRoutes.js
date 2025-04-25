const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, appointmentController.createAppointment);
router.get("/:email", verifyToken, appointmentController.getAppointmentsByEmail);
router.put("/:id", verifyToken, appointmentController.updateAppointment);
router.delete("/:id", verifyToken, appointmentController.deleteAppointment);

module.exports = router;
