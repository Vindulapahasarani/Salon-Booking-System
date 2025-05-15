const User = require("../models/user");

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      city,
      profilePicture,
      preferredStylists,
      preferredPaymentMethod,
    } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (mobile) updateFields.mobile = mobile;
    if (city) updateFields.city = city;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (preferredStylists) updateFields.preferredStylists = preferredStylists;
    if (preferredPaymentMethod)
      updateFields.preferredPaymentMethod = preferredPaymentMethod;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
