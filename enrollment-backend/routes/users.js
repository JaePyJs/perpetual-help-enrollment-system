const express = require("express");
const User = require("../models/User");
const { auth, checkRole, checkGlobalAdmin } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const auditService = require("../services/auditService");
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
      const { name, email, password, role, ...otherFields } = req.body;

      // Check if user is trying to create an admin or global-admin
      if (role === "admin" || role === "global-admin") {
        // Only global-admin can create admin accounts
        if (req.user.role !== "global-admin") {
          return res.status(403).json({
            message: "Only global administrators can create admin accounts",
          });
        }

        // Only global-admin can create global-admin accounts
        if (role === "global-admin" && req.user.role !== "global-admin") {
          return res.status(403).json({
            message:
              "Only global administrators can create global admin accounts",
          });
        }
      }

      // Create the user
      const userData = {
        name,
        email,
        password,
        role,
        ...otherFields,
        passwordResetRequired: true, // Force password reset on first login
      };

      const user = new User(userData);
      await user.save();

      // Log the action
      await auditService.log(
        req,
        "user_create",
        {
          email: user.email,
          role: user.role,
          createdBy: req.user.id,
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(400).json({ message: "Email already in use" });
      }

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
      const {
        role,
        search,
        status,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build query
      const query = {};

      // Filter by role
      if (role && role !== "all") {
        query.role = role;
      }

      // Filter by status
      if (status && status !== "all") {
        query.status = status;
      }

      // Search by name or email
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Count total matching documents
      const total = await User.countDocuments(query);

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Get users
      const users = await User.find(query)
        .select("-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  }
);

// Get a single user by ID
router.get(
  "/:id",
  auth,
  checkRole(["admin", "global-admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  }
);

// Update a user
router.put(
  "/:id",
  auth,
  checkRole(["admin", "global-admin"]),
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("status")
      .optional()
      .isIn(["active", "inactive", "suspended"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.params.id;
      const { role, ...updateData } = req.body;

      // Get the user to update
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check permissions for role changes
      if (role && role !== user.role) {
        // Only global admin can change roles
        if (req.user.role !== "global-admin") {
          return res.status(403).json({
            message: "Only global administrators can change user roles",
          });
        }

        // Cannot change global admin role unless you are a global admin
        if (
          (user.role === "global-admin" || role === "global-admin") &&
          req.user.role !== "global-admin"
        ) {
          return res.status(403).json({
            message:
              "Only global administrators can modify global admin accounts",
          });
        }

        // Update the role
        updateData.role = role;
      }

      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      // Log the action
      await auditService.log(
        req,
        "user_update",
        {
          updates: updateData,
          previousData: {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          },
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);

      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(400).json({ message: "Email already in use" });
      }

      res.status(500).json({ message: "Error updating user" });
    }
  }
);

// Reset user password
router.post(
  "/:id/reset-password",
  auth,
  checkRole(["admin", "global-admin"]),
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Get the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check permissions for global admin accounts
      if (user.role === "global-admin" && req.user.role !== "global-admin") {
        return res.status(403).json({
          message:
            "Only global administrators can reset passwords for global admin accounts",
        });
      }

      // Generate a temporary password (in a real app, you might want to make this more secure)
      const tempPassword = Math.random().toString(36).slice(-8);

      // Update the user's password and set passwordResetRequired to true
      user.password = tempPassword;
      user.passwordResetRequired = true;
      await user.save();

      // Log the action
      await auditService.log(
        req,
        "user_password_reset",
        { userId: user._id },
        { id: user._id, name: user.name, role: user.role }
      );

      res.json({
        message: "Password reset successfully",
        tempPassword, // In a real app, you would send this via email instead
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  }
);

// Deactivate/activate a user
router.patch(
  "/:id/status",
  auth,
  checkRole(["admin", "global-admin"]),
  [
    body("status")
      .isIn(["active", "inactive", "suspended"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.params.id;
      const { status } = req.body;

      // Get the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check permissions for global admin accounts
      if (user.role === "global-admin" && req.user.role !== "global-admin") {
        return res.status(403).json({
          message:
            "Only global administrators can change status for global admin accounts",
        });
      }

      // Update the user's status
      const previousStatus = user.status;
      user.status = status;
      await user.save();

      // Log the action
      const actionType =
        status === "active" ? "user_activate" : "user_deactivate";
      await auditService.log(
        req,
        actionType,
        {
          userId: user._id,
          previousStatus,
          newStatus: status,
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.json({
        message: `User ${
          status === "active" ? "activated" : "deactivated"
        } successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Error updating user status" });
    }
  }
);

// Create a student user (with student-specific fields)
router.post(
  "/students",
  auth,
  checkRole(["admin", "global-admin"]),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("department")
      .isIn(["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"])
      .withMessage("Invalid department"),
    body("yearLevel")
      .isInt({ min: 1, max: 6 })
      .withMessage("Year level must be between 1 and 6"),
    body("section")
      .optional()
      .isString()
      .withMessage("Section must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        email,
        password,
        department,
        yearLevel,
        section,
        ...otherFields
      } = req.body;

      // Create the student user
      const userData = {
        name,
        email,
        password,
        role: "student",
        department,
        yearLevel: parseInt(yearLevel),
        section,
        ...otherFields,
        passwordResetRequired: true,
      };

      const user = new User(userData);
      await user.save();

      // Log the action
      await auditService.log(
        req,
        "user_create",
        {
          email: user.email,
          role: "student",
          department,
          yearLevel,
          createdBy: req.user.id,
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.status(201).json({
        message: "Student created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          yearLevel: user.yearLevel,
          section: user.section,
        },
      });
    } catch (error) {
      console.error("Error creating student:", error);

      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(400).json({ message: "Email already in use" });
      }

      res.status(500).json({ message: "Error creating student" });
    }
  }
);

// Create a teacher user (with teacher-specific fields)
router.post(
  "/teachers",
  auth,
  checkRole(["admin", "global-admin"]),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("specialization")
      .isArray()
      .withMessage("Specialization must be an array"),
    body("employeeId")
      .optional()
      .isString()
      .withMessage("Employee ID must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        email,
        password,
        specialization,
        employeeId,
        ...otherFields
      } = req.body;

      // Create the teacher user
      const userData = {
        name,
        email,
        password,
        role: "teacher",
        specialization,
        employeeId,
        ...otherFields,
        passwordResetRequired: true,
      };

      const user = new User(userData);
      await user.save();

      // Log the action
      await auditService.log(
        req,
        "user_create",
        {
          email: user.email,
          role: "teacher",
          specialization,
          employeeId,
          createdBy: req.user.id,
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.status(201).json({
        message: "Teacher created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialization: user.specialization,
          employeeId: user.employeeId,
        },
      });
    } catch (error) {
      console.error("Error creating teacher:", error);

      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(400).json({ message: "Email already in use" });
      }

      res.status(500).json({ message: "Error creating teacher" });
    }
  }
);

// Create an admin user (global admin only)
router.post(
  "/admins",
  auth,
  checkGlobalAdmin({ action: "create administrator accounts" }), // Only global admins can create admin accounts
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("isGlobalAdmin")
      .optional()
      .isBoolean()
      .withMessage("isGlobalAdmin must be a boolean"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        email,
        password,
        isGlobalAdmin = false,
        ...otherFields
      } = req.body;

      // Create the admin user
      const userData = {
        name,
        email,
        password,
        role: isGlobalAdmin ? "global-admin" : "admin",
        ...otherFields,
        passwordResetRequired: true,
      };

      const user = new User(userData);
      await user.save();

      // Log the action
      await auditService.log(
        req,
        "user_create",
        {
          email: user.email,
          role: user.role,
          createdBy: req.user.id,
        },
        { id: user._id, name: user.name, role: user.role }
      );

      res.status(201).json({
        message: `${
          isGlobalAdmin ? "Global admin" : "Admin"
        } created successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);

      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(400).json({ message: "Email already in use" });
      }

      res.status(500).json({ message: "Error creating admin" });
    }
  }
);

// Get audit logs (admin only, with enhanced access for global admins)
router.get(
  "/audit-logs",
  auth,
  checkRole(["admin", "global-admin"]),
  async (req, res) => {
    try {
      const {
        action,
        userId,
        targetId,
        startDate,
        endDate,
        page = 1,
        limit = 20,
      } = req.query;

      // Build filters
      const filters = {};

      if (action) filters.action = action;
      if (userId) filters.userId = userId;
      if (targetId) filters.targetId = targetId;
      if (startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      // Regular admins can only see non-sensitive logs
      // Global admins can see all logs
      if (req.user.role !== "global-admin") {
        // Exclude sensitive actions for regular admins
        filters.excludeActions = ["system_setting", "security_alert"];

        // Regular admins can't see global admin actions
        filters.excludeUserRoles = ["global-admin"];
      }

      // Get audit logs
      const result = await auditService.getAuditLogs(filters, page, limit);

      res.json(result);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Error fetching audit logs" });
    }
  }
);

module.exports = router;
