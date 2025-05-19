const User = require("../models/user");

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User information missing from token.' });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // User is admin, continue
  } catch (err) {
    console.error("verifyAdmin error:", err.message);
    res.status(500).json({ message: "Server error during admin verification." });
  }
};

module.exports = verifyAdmin;