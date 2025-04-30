const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // User is admin, continue
  } catch (err) {
    console.error("verifyAdmin error:", err.message);
    res.status(500).json({ message: "Server error during admin verification." });
  }
};

module.exports = verifyAdmin;
