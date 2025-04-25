const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // ✅ Check if Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token Verified:", decoded); // Logs userId, email, etc.
    req.user = decoded; // 🛡️ Attach user info to request
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
