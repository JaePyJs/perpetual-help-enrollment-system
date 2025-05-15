const mongoose = require("mongoose");

/**
 * Attendance Model
 * Tracks student attendance for courses
 */
const attendanceSchema = new mongoose.Schema({
  // Course reference
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  
  // Teacher who recorded the attendance
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Date of the class session
  date: {
    type: Date,
    required: true,
  },
  
  // Academic term/year
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  
  // Class session info
  sessionType: {
    type: String,
    enum: ["lecture", "laboratory", "tutorial", "exam", "other"],
    default: "lecture",
  },
  
  // Session/period number within the term
  sessionNumber: {
    type: Number,
    required: true,
  },
  
  // Duration of class in minutes
  duration: {
    type: Number,
    default: 60,
  },
  
  // Student attendance records
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    minutesLate: {
      type: Number,
      default: 0,
    },
    notes: String,
  }],
  
  // Additional class notes
  notes: String,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Indexes for faster querying
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ "records.student": 1, date: 1 });

// Virtual for calculating attendance percentage
attendanceSchema.virtual('presentCount').get(function() {
  return this.records.filter(record => record.status === 'present').length;
});

attendanceSchema.virtual('attendancePercentage').get(function() {
  return (this.presentCount / this.records.length) * 100;
});

// Update the updatedAt timestamp
attendanceSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
