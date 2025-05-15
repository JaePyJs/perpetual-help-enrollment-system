const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Login route - supports both email and student ID login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if username is email or student ID
    const isEmail = username.includes('@');
    
    // Find user by email or student ID
    const user = isEmail 
      ? await User.findOne({ email: username })
      : await User.findOne({ studentId: username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    // Check if user needs to change password
    const passwordChangeRequired = user.passwordResetRequired;

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        passwordChangeRequired
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change password route (requires authentication)
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    
    // Update to new password
    user.password = newPassword; // Will be hashed by pre-save hook
    user.passwordResetRequired = false;
    user.updatedAt = new Date();
    
    await user.save();
    
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Request password reset (for forgotten passwords)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal that the email doesn't exist
      return res.json({ message: "If the email exists, a reset link will be sent" });
    }
    
    // Generate a reset token valid for 1 hour
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    // In a real application, you would send this token by email
    // For development purposes, we'll return it in the response
    
    // Mark that password reset is required
    user.passwordResetRequired = true;
    await user.save();
    
    // For a real application, don't return the token in the response
    // Instead, send it via email and just return a success message
    res.json({
      message: "Reset instructions sent to your email",
      resetToken: resetToken // Remove this in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    user.passwordResetRequired = false;
    user.updatedAt = new Date();
    
    await user.save();
    
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user profile (requires authentication)
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find user without returning the password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If student, get student profile
    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: userId });
    }
    
    res.json({
      user,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
