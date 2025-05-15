const express = require("express");
const User = require("../models/User");
const { auth, checkRole } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Create user (admin only, with validation)
router.post(
  "/",
  auth,
  checkRole(["admin", "global-admin"]),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .isIn(["student", "teacher", "admin", "global-admin"])
      .withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password, role } = req.body;
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  }
);

// Get all users (admin only, no password field)
router.get(
  "/",
  auth,
  checkRole(["admin", "global-admin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }
);

module.exports = router;
