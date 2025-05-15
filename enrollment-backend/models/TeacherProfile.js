const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: String,
  lastName: {
    type: String,
    required: true
  },
  contactNumber: String,
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"],
    required: true
  },
  position: {
    type: String,
    required: true
  },
  specializations: [{
    type: String,
    required: true
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  dateHired: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive", "on leave"],
    default: "active"
  },
  officeHours: [{
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    startTime: String,
    endTime: String,
    location: String
  }],
  subjectsHandled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }]
}, { timestamps: true });

// Generate employee ID for teachers
teacherProfileSchema.statics.generateEmployeeId = async function(department) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  
  // Define department prefix codes
  const departmentCodes = {
    "BSIT": "T14",
    "BSCS": "T15",
    "BSN": "T16",
    "BS RADTECH": "T17",
    "SHS": "T18",
    "JHS": "T19"
  };
  
  // Get department code or use default
  const deptCode = departmentCodes[department] || "T14";
  
  // Find the highest sequential number currently used
  const lastTeacher = await this.findOne({ 
    employeeId: new RegExp(`^${deptCode}-${currentYear}`)
  }).sort({ employeeId: -1 });
  
  let sequentialNumber = 1001; // Start with 1001 if no teachers exist
  
  if (lastTeacher) {
    // Extract the sequential number from the ID
    const lastIdParts = lastTeacher.employeeId.split('-');
    if (lastIdParts.length >= 2) {
      const lastSequential = parseInt(lastIdParts[1]);
      sequentialNumber = isNaN(lastSequential) ? 1001 : lastSequential + 1;
    }
  }
  
  // Format: T14-1001 (for BSIT teacher)
  return `${deptCode}-${sequentialNumber}`;
};

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema);
