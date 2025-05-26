const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken"); // Import the middleware

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout); // New logout route

// Protected routes
router.get("/me", verifyToken, authController.getMe);
router.put("/update-profile", verifyToken, authController.updateProfile); // ✅ New route for updating profile

module.exports = router;