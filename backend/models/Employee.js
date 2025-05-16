// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Employee position is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Employee email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Optional phone format validation (e.g., 10–15 digits)
          return !v || /^[0-9\-\+\s]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '', // URL or path to profile image
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Pre-save middleware (optional custom logic placeholder)
employeeSchema.pre('save', function (next) {
  // Example: this.name = this.name.trim();
  next();
});

// Index for fast email lookup and to ensure uniqueness
employeeSchema.index({ email: 1 }, { unique: true });

// Export the model
const Employee =
  mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

module.exports = Employee;
