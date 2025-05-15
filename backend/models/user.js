const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    // Profile details
    mobile: { type: String },
    city: { type: String },
    profilePicture: { type: String }, // URL or base64 string
    preferredStylists: [{ type: String }], // Optional list of stylist names or IDs

    // Payment preferences
    preferredPaymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
  },
  { timestamps: true }
);

// Prevent redefinition in dev with hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
