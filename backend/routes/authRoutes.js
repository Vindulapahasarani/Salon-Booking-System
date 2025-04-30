const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken"); // Import the middleware

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route - must have token
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
