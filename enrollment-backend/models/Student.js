const mongoose = require("mongoose");
const validator = require("validator");

/**
 * Student Model
 * Represents a student in the enrollment system
 */
const studentSchema = new mongoose.Schema({
  // Student ID follows the format m[YY]-XXXX-XXX
  studentId: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^m\d{2}-\d{4}-\d{3}$/,
      "Student ID must follow the format: mYY-XXXX-XXX (e.g., m23-1470-578)",
    ],
    trim: true,
  },

  // Email must follow the format [student-id]@manila.uphsl.edu.ph
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Basic email format validation
        if (!validator.isEmail(value)) {
          return false;
        }

        // School-specific domain validation
        if (!value.endsWith("@manila.uphsl.edu.ph")) {
          return false;
        }

        // Email must match pattern based on student ID
        const expectedEmail = `${this.studentId}@manila.uphsl.edu.ph`;
        return value === expectedEmail;
      },
      message: (props) =>
        "Email must match the standard format: m23-1470-578@manila.uphsl.edu.ph",
    },
  },

  // Basic profile information
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  // Relationships
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  // Academic information
  enrollmentYear: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        // Extract YY from student ID and ensure it matches enrollment year
        const yearFromId = this.studentId.substr(1, 2);
        const yearFromEnrollment = value.toString().substr(2, 2);
        return yearFromId === yearFromEnrollment;
      },
      message: (props) => "Enrollment year must match year in student ID",
    },
  },
  program: {
    type: String,
    required: true,
    trim: true,
  },
  yearLevel: {
    type: Number,
    min: 1,
    max: 6,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "graduated", "leave of absence", "dismissed"],
    default: "active",
  },

  // Academic records
  coursesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
  ],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure email format is correct before saving
studentSchema.pre("validate", function (next) {
  const expectedEmail = `${this.studentId}@manila.uphsl.edu.ph`;
  if (this.email !== expectedEmail) {
    this.invalidate(
      "email",
      "Email must match the standard format: m23-1470-578@manila.uphsl.edu.ph"
    );
  }
  next();
});

// Update the updatedAt timestamp before save
studentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
