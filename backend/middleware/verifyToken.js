const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info (e.g. id, email, isAdmin) to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);

    const errorMsg =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token.";

    return res.status(403).json({ message: `Forbidden: ${errorMsg}` });
  }
};

module.exports = verifyToken;
