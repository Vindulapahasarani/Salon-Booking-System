const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const verifyToken = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed!",
    user: req.user,
  });
});

module.exports = router;
