const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  semesters: [{
    name: {
      type: String,
      enum: ["1st", "2nd", "Summer"],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    enrollmentPeriod: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    lateEnrollmentPeriod: {
      start: Date,
      end: Date,
      penaltyFee: {
        type: Number,
        default: 0
      }
    },
    addDropPeriod: {
      start: Date,
      end: Date
    },
    midtermPeriod: {
      start: Date,
      end: Date
    },
    finalsPeriod: {
      start: Date,
      end: Date
    },
    gradeSubmissionDeadline: Date,
    holidayBreaks: [{
      name: String,
      startDate: Date,
      endDate: Date
    }],
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending"
    }
  }],
  isCurrentYear: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending"
  }
}, { timestamps: true });

// Ensure only one academic year can be set as current
academicYearSchema.pre("save", async function(next) {
  if (this.isCurrentYear) {
    // Find any other academic years set as current
    const otherCurrentYears = await this.constructor.find({
      _id: { $ne: this._id },
      isCurrentYear: true
    });
    
    // Update all other current years to not be current
    if (otherCurrentYears.length > 0) {
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isCurrentYear: true },
        { $set: { isCurrentYear: false } }
      );
    }
  }
  next();
});

// Helper method to get current academic year
academicYearSchema.statics.getCurrentAcademicYear = async function() {
  let currentYear = await this.findOne({ isCurrentYear: true });
  
  // If no academic year is set as current, find one based on date
  if (!currentYear) {
    const today = new Date();
    currentYear = await this.findOne({
      startDate: { $lte: today },
      endDate: { $gte: today }
    });
  }
  
  return currentYear;
};

// Helper method to get current semester
academicYearSchema.statics.getCurrentSemester = async function() {
  const currentYear = await this.getCurrentAcademicYear();
  
  if (!currentYear) return null;
  
  const today = new Date();
  const currentSemester = currentYear.semesters.find(
    semester => new Date(semester.startDate) <= today && new Date(semester.endDate) >= today
  );
  
  return currentSemester;
};

// Check if enrollment is currently open
academicYearSchema.statics.isEnrollmentOpen = async function() {
  const currentSemester = await this.getCurrentSemester();
  
  if (!currentSemester) return false;
  
  const today = new Date();
  const enrollmentStart = new Date(currentSemester.enrollmentPeriod.start);
  const enrollmentEnd = new Date(currentSemester.enrollmentPeriod.end);
  
  // Check regular enrollment period
  if (today >= enrollmentStart && today <= enrollmentEnd) {
    return { open: true, isLate: false };
  }
  
  // Check late enrollment period
  if (currentSemester.lateEnrollmentPeriod && 
      currentSemester.lateEnrollmentPeriod.start && 
      currentSemester.lateEnrollmentPeriod.end) {
    
    const lateStart = new Date(currentSemester.lateEnrollmentPeriod.start);
    const lateEnd = new Date(currentSemester.lateEnrollmentPeriod.end);
    
    if (today >= lateStart && today <= lateEnd) {
      return { 
        open: true, 
        isLate: true, 
        penaltyFee: currentSemester.lateEnrollmentPeriod.penaltyFee 
      };
    }
  }
  
  return { open: false, isLate: false };
};

module.exports = mongoose.model("AcademicYear", academicYearSchema);
