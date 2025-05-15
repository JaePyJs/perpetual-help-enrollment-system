const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile"
  },
  academicYear: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    enum: ["1st", "2nd", "Summer"],
    required: true,
  },
  yearLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  department: {
    type: String,
    enum: ["BSIT", "BSCS", "BSN", "BS RADTECH", "SHS", "JHS"],
    required: true
  },
  program: {
    type: String,
    required: true
  },
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    section: {
      type: String,
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    schedule: [{
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      startTime: String,
      endTime: String,
      room: String
    }],
    grades: {
      attendance: {
        type: Number,
        min: 0,
        max: 100
      },
      quizzes: {
        type: Number,
        min: 0,
        max: 100
      },
      assignments: {
        type: Number,
        min: 0,
        max: 100
      },
      projects: {
        type: Number,
        min: 0,
        max: 100
      },
      midterm: {
        type: Number,
        min: 0,
        max: 100
      },
      finals: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    finalGrade: {
      type: Number,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ["enrolled", "dropped", "incomplete", "completed"],
      default: "enrolled"
    },
    remarks: String
  }],
  enrollmentStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  // Financial information
  tuitionFee: {
    type: Number,
    default: 0
  },
  miscFees: {
    type: Number,
    default: 0
  },
  labFees: {
    type: Number,
    default: 0
  },
  totalFees: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  scholarshipType: String,
  payments: [{
    amount: Number,
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank transfer", "credit card", "scholarship"]
    },
    referenceNumber: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    notes: String
  }],
  balance: {
    type: Number,
    default: 0
  },
  // Tracking
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  dateApproved: Date,
  dateRejected: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rejectionReason: String,
  notes: String
}, { timestamps: true });

// Calculate the balance before saving
enrollmentSchema.pre("save", function(next) {
  // Calculate total payments
  const totalPayments = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate total fees
  this.totalFees = this.tuitionFee + this.miscFees + this.labFees;
  
  // Apply discount
  const discountAmount = (this.totalFees * this.discount) / 100;
  
  // Calculate remaining balance
  this.balance = this.totalFees - discountAmount - totalPayments;
  
  next();
});

// Method to add a payment
enrollmentSchema.methods.addPayment = async function(paymentData) {
  this.payments.push(paymentData);
  await this.save();
  return this;
};

// Method to calculate GPA (Grade Point Average)
enrollmentSchema.methods.calculateGPA = function() {
  let totalPoints = 0;
  let totalUnits = 0;
  
  this.subjects.forEach(subject => {
    if (subject.finalGrade) {
      // Assuming each subject document has the complete subject info
      const units = subject.subject.units?.total || 3; // Default to 3 units if not specified
      totalUnits += units;
      
      // Convert percentage grade to 4.0 scale (example conversion)
      let gradePoint = 0;
      if (subject.finalGrade >= 95) gradePoint = 4.0;
      else if (subject.finalGrade >= 90) gradePoint = 3.75;
      else if (subject.finalGrade >= 85) gradePoint = 3.5;
      else if (subject.finalGrade >= 80) gradePoint = 3.0;
      else if (subject.finalGrade >= 75) gradePoint = 2.5;
      else gradePoint = 0;
      
      totalPoints += gradePoint * units;
    }
  });
  
  return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0;
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
