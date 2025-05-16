const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testEmailRoute = require("./routes/testEmail");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express();

// ✅ CORS middleware — allow requests from frontend (http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Special handling for Stripe webhook route
// This must be before the express.json() middleware
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// ✅ Middleware to parse JSON requests for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/test", testEmailRoute);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
<<<<<<< HEAD
=======
app.use('/api/employees', employeeRoutes);
>>>>>>> a310d24 (Your commit message here)

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Create a route for testing Stripe config
app.get('/api/config/stripe', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});