const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Import cors


const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testEmailRoute = require('./routes/testEmail');
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();

// ✅ CORS middleware — allow requests from frontend (http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/test', testEmailRoute);
app.use("/api/contact", contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));


// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
