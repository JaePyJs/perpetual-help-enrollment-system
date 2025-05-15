const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness if field exists
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
  },
  profileImage: {
    type: String,
    default: "default-profile.png"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active"
  },
  contactNumber: String,
  address: String,
  lastLogin: Date,
  passwordResetRequired: {
    type: Boolean,
    default: true
  },
  
  // Role-specific fields
  // For students
  department: {
    type: String,
    enum: ["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"],
    required: function() { return this.role === "student"; }
  },
  yearLevel: {
    type: Number,
    min: 1,
    max: 6, // Accounting for K-12 year levels
    required: function() { return this.role === "student"; }
  },
  section: String,
  
  // For teachers
  specialization: [String],
  employeeId: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
