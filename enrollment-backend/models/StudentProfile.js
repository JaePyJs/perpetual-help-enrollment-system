const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  studentId: {
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
  birthDate: Date,
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  nationality: String,
  guardianName: String,
  guardianContact: String,
  emergencyContact: String,
  
  // Academic information
  department: {
    type: String,
    enum: ["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"],
    required: true
  },
  program: String, // Specific program within department
  yearLevel: {
    type: Number,
    min: 1,
    max: 6,
    required: true
  },
  academicStatus: {
    type: String,
    enum: ["regular", "irregular", "probation", "LOA", "graduated", "transferred"],
    default: "regular"
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  
  // Financial information
  balance: {
    type: Number,
    default: 0
  },
  scholarshipType: String,
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Documents
  documents: [{
    name: String,
    path: String,
    dateUploaded: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

// Static method to generate student ID
studentProfileSchema.statics.generateStudentId = async function(department) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  
  // Define department prefix codes (if they follow a pattern)
  const departmentCodes = {
    "BSIT": "14",
    "BSCS": "15",
    "BSN": "16",
    "BS RADTECH": "17",
    "SHS": "18",
    "JHS": "19"
  };
  
  // Get department code or use default
  const deptCode = departmentCodes[department] || "14";
  
  // Find the highest sequential number currently used
  const lastStudent = await this.findOne({ 
    studentId: new RegExp(`^m${currentYear}-${deptCode}`)
  }).sort({ studentId: -1 });
  
  let sequentialNumber = 100; // Start with 100 if no students exist
  
  if (lastStudent) {
    // Extract the last 3 digits from the ID
    const lastIdParts = lastStudent.studentId.split('-');
    if (lastIdParts.length >= 3) {
      const lastSequential = parseInt(lastIdParts[2]);
      sequentialNumber = isNaN(lastSequential) ? 100 : lastSequential + 1;
    }
  }
  
  // Format: m23-1470-578 (for BSIT)
  return `m${currentYear}-${deptCode}${Math.floor(Math.random() * 10)}-${sequentialNumber}`;
};

// Create a method to generate email from student ID
studentProfileSchema.methods.generateEmail = function() {
  return `${this.studentId}@manila.uphsl.edu.ph`;
};

// Pre-save hook to set user's email based on student ID
studentProfileSchema.pre("save", async function(next) {
  if (this.isNew) {
    // Find the associated user to update their email
    const User = mongoose.model("User");
    const user = await User.findById(this.user);
    
    if (user) {
      user.email = this.generateEmail();
      user.studentId = this.studentId;
      await user.save();
    }
  }
  next();
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
