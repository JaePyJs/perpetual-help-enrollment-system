const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  units: {
    lecture: {
      type: Number,
      required: true,
      default: 0
    },
    laboratory: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  department: {
    type: String,
    enum: ["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"],
    required: true
  },
  yearLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: String,
    enum: ["1st", "2nd", "Summer"],
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  corequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  isCore: {
    type: Boolean,
    default: true
  },
  isElective: {
    type: Boolean,
    default: false
  },
  maxStudents: {
    type: Number,
    default: 40
  },
  syllabus: {
    type: String // URL or file path to the syllabus
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

// Virtual for total units calculation
subjectSchema.virtual('totalUnits').get(function() {
  return this.units.lecture + this.units.laboratory;
});

// Method to check if prerequisites are satisfied
subjectSchema.methods.checkPrerequisites = async function(studentId) {
  const Enrollment = mongoose.model('Enrollment');
  
  // If no prerequisites, return true
  if (!this.prerequisites || this.prerequisites.length === 0) {
    return true;
  }
  
  // Get student's passed subjects
  const passedEnrollments = await Enrollment.find({
    student: studentId,
    status: 'approved',
    finalGrade: { $gte: 75 } // Passing grade threshold
  }).populate('course');
  
  // Extract course IDs from passed enrollments
  const passedCourseIds = passedEnrollments.map(enrollment => 
    enrollment.course && enrollment.course._id ? enrollment.course._id.toString() : null
  ).filter(id => id !== null);
  
  // Check if all prerequisites are in the passed courses
  for (const prereqId of this.prerequisites) {
    if (!passedCourseIds.includes(prereqId.toString())) {
      return false;
    }
  }
  
  return true;
};

module.exports = mongoose.model("Subject", subjectSchema);
