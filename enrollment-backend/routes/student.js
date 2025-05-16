const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { auth, checkRole } = require("../middleware/auth");
const Student = require("../models/Student");
const User = require("../models/User");
const Department = require("../models/Department");
const StudentProfile = require("../models/StudentProfile");
const validationSchemas = require("../utils/validationSchemas");
const monitoring = require("../monitoring");

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Admin, Teacher
 */
router.get("/", auth, checkRole(["admin", "teacher"]), async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Support filtering
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.yearLevel) filter.yearLevel = parseInt(req.query.yearLevel);
    if (req.query.department) filter.department = req.query.department;
    if (req.query.enrollmentYear)
      filter.enrollmentYear = parseInt(req.query.enrollmentYear);

    // Support searching
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { studentId: searchRegex },
        { email: searchRegex },
      ];
    }

    // Get total count for pagination
    const total = await Student.countDocuments(filter);

    // Get students with pagination and populate department
    const students = await Student.find(filter)
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get a student by ID
 * @access  Admin, Teacher, Self
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Allow access only to admin, the student themselves, or their teachers
    if (req.user.role !== "admin" && req.user.userId !== id) {
      // If teacher, check if student is in their class (simplified for now)
      if (req.user.role === "teacher") {
        // Logic to check if student is in teacher's class would go here
      } else {
        return res.status(403).json({ error: "Not authorized" });
      }
    }

    // Get student with department info
    const student = await Student.findById(id).populate(
      "department",
      "name code"
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ student });
  } catch (error) {
    console.error("Error retrieving student:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/students
 * @desc    Create a new student
 * @access  Admin
 */
router.post(
  "/",
  [
    auth,
    checkRole(["admin"]),
    // Validation middleware
    ...validationSchemas.studentValidations.createStudent,
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: "Validation error", details: errors.array() });
      }

      const {
        studentId,
        email,
        firstName,
        lastName,
        middleName,
        department,
        enrollmentYear,
        program,
      } = req.body;

      // Check if student ID or email already exists
      const existingStudent = await Student.findOne({
        $or: [{ studentId }, { email }],
      });

      if (existingStudent) {
        return res
          .status(400)
          .json({ error: "Student ID or email already exists" });
      }

      // Verify department exists
      const departmentDoc = await Department.findById(department);
      if (!departmentDoc) {
        return res.status(400).json({ error: "Department not found" });
      }

      // Create student record
      const student = new Student({
        studentId,
        email,
        firstName,
        lastName,
        middleName,
        department,
        enrollmentYear,
        program,
      });

      await student.save();

      // Track student registration in monitoring system
      if (monitoring && monitoring.trackStudentRegistration) {
        monitoring.trackStudentRegistration(studentId, departmentDoc.code);
      }

      // Create user account if it doesn't exist
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name: `${firstName} ${lastName}`,
          email,
          studentId,
          password: "123", // Default password as required
          role: "student",
          passwordResetRequired: true,
        });

        await user.save();
      }

      res.status(201).json({
        message: "Student created successfully",
        student: {
          _id: student._id,
          studentId: student.studentId,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          enrollmentYear: student.enrollmentYear,
          program: student.program,
        },
      });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update a student
 * @access  Admin, Self
 */
router.put(
  "/:id",
  [
    auth,
    // Validation middleware
    ...validationSchemas.studentValidations.updateStudent,
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: "Validation error", details: errors.array() });
      }

      const { id } = req.params;

      // Only admin or the student themselves can update
      if (req.user.role !== "admin" && req.user.userId !== id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Find student
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Don't allow changing studentId or email
      if (req.body.studentId || req.body.email) {
        return res
          .status(400)
          .json({ error: "Cannot change studentId or email" });
      }

      // Update allowed fields
      const allowedUpdates = [
        "firstName",
        "lastName",
        "middleName",
        "program",
        "yearLevel",
        "status",
      ];
      const updates = {};

      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      // Update student
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate("department", "name code");

      // Update user name if first or last name changed
      if (updates.firstName || updates.lastName) {
        await User.findOneAndUpdate(
          { email: student.email },
          {
            $set: {
              name: `${updates.firstName || student.firstName} ${
                updates.lastName || student.lastName
              }`,
            },
          }
        );
      }

      res.json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student
 * @access  Admin
 */
router.delete("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete student record
    await Student.findByIdAndDelete(id);

    // Delete associated user account
    await User.findOneAndDelete({ email: student.email });

    // Delete student profile if it exists
    await StudentProfile.findOneAndDelete({ user: id });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
