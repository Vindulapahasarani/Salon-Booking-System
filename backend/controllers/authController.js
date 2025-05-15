// controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT including essential info
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, mobile, city, profilePicture, preferredStylists } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // First registered user becomes admin
    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      mobile,
      city,
      profilePicture,
      preferredStylists,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        mobile: newUser.mobile,
        city: newUser.city,
        profilePicture: newUser.profilePicture,
        preferredStylists: newUser.preferredStylists,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        mobile: user.mobile,
        city: user.city,
        profilePicture: user.profilePicture,
        preferredStylists: user.preferredStylists,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's info
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ GetMe error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, mobile, city, profilePicture, preferredStylists } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (city) user.city = city;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferredStylists) user.preferredStylists = preferredStylists;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        mobile: user.mobile,
        city: user.city,
        profilePicture: user.profilePicture,
        preferredStylists: user.preferredStylists,
      },
    });
  } catch (err) {
    console.error("❌ Update Profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
