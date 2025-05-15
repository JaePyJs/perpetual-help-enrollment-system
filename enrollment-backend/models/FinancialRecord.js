const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile"
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ["1st", "2nd", "Summer"],
    required: true
  },
  enrollmentReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment"
  },
  // Fee breakdown
  tuitionFee: {
    baseFee: {
      type: Number,
      default: 0
    },
    perUnitFee: {
      type: Number,
      default: 0
    },
    totalUnits: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  miscellaneousFees: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],
  laboratoryFees: [{
    subjectCode: String,
    amount: {
      type: Number,
      required: true
    }
  }],
  otherFees: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],
  // Discount and scholarship
  discounts: [{
    type: {
      type: String,
      enum: ["academic", "employee", "sibling", "promotional", "other"],
      required: true
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    },
    description: String
  }],
  scholarship: {
    type: {
      type: String,
      enum: ["academic", "athletic", "government", "private", "institutional", "none"],
      default: "none"
    },
    name: String,
    coverage: {
      tuition: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      miscellaneous: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      laboratory: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      other: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    },
    sponsor: String,
    contactPerson: String,
    sponsorContact: String,
    notes: String
  },
  // Financial summary
  totalAssessment: {
    type: Number,
    default: 0
  },
  totalDiscounts: {
    type: Number,
    default: 0
  },
  totalDue: {
    type: Number,
    default: 0
  },
  // Payment records
  payments: [{
    receiptNumber: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "check", "bank transfer", "credit card", "debit card", "online payment", "scholarship"],
      required: true
    },
    bank: String,
    checkNumber: String,
    referenceNumber: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    notes: String
  }],
  // Current balance calculation
  remainingBalance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "partially paid", "fully paid", "overdue", "waived"],
    default: "pending"
  },
  dueDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  notes: String
}, { timestamps: true });

// Calculate financial totals before saving
financialRecordSchema.pre("save", function(next) {
  // Calculate tuition total
  this.tuitionFee.total = this.tuitionFee.baseFee + (this.tuitionFee.perUnitFee * this.tuitionFee.totalUnits);
  
  // Calculate total miscellaneous fees
  const totalMiscFees = this.miscellaneousFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // Calculate total laboratory fees
  const totalLabFees = this.laboratoryFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // Calculate total other fees
  const totalOtherFees = this.otherFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // Calculate total assessment (before discounts)
  this.totalAssessment = this.tuitionFee.total + totalMiscFees + totalLabFees + totalOtherFees;
  
  // Calculate total discounts
  let discountTotal = 0;
  this.discounts.forEach(discount => {
    if (discount.percentage > 0) {
      discount.amount = (this.totalAssessment * discount.percentage) / 100;
    }
    discountTotal += discount.amount;
  });
  
  // Apply scholarship discounts
  let scholarshipDiscount = 0;
  if (this.scholarship.type !== 'none') {
    scholarshipDiscount += (this.tuitionFee.total * this.scholarship.coverage.tuition) / 100;
    scholarshipDiscount += (totalMiscFees * this.scholarship.coverage.miscellaneous) / 100;
    scholarshipDiscount += (totalLabFees * this.scholarship.coverage.laboratory) / 100;
    scholarshipDiscount += (totalOtherFees * this.scholarship.coverage.other) / 100;
  }
  
  this.totalDiscounts = discountTotal + scholarshipDiscount;
  
  // Calculate total due
  this.totalDue = this.totalAssessment - this.totalDiscounts;
  
  // Calculate total payments
  const totalPayments = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate remaining balance
  this.remainingBalance = this.totalDue - totalPayments;
  
  // Update status based on payment
  if (this.remainingBalance <= 0) {
    this.status = "fully paid";
  } else if (totalPayments > 0) {
    this.status = "partially paid";
  } else if (this.dueDate && this.dueDate < new Date()) {
    this.status = "overdue";
  }
  
  next();
});

// Method to add a payment
financialRecordSchema.methods.addPayment = async function(paymentData) {
  this.payments.push(paymentData);
  await this.save();
  return this;
};

// Generate an official receipt
financialRecordSchema.methods.generateReceipt = function(paymentIndex) {
  if (!this.payments[paymentIndex]) {
    throw new Error("Payment not found");
  }
  
  const payment = this.payments[paymentIndex];
  
  return {
    receiptNumber: payment.receiptNumber,
    studentId: this.studentProfile ? this.studentProfile.studentId : "N/A",
    studentName: "To be populated from profile",
    date: payment.date,
    academicYear: this.academicYear,
    semester: this.semester,
    paymentDetails: {
      amount: payment.amount,
      method: payment.paymentMethod,
      reference: payment.referenceNumber || payment.checkNumber,
      receivedBy: payment.receivedBy
    },
    breakdown: {
      tuition: this.tuitionFee.total,
      miscellaneous: this.miscellaneousFees.reduce((sum, fee) => sum + fee.amount, 0),
      laboratory: this.laboratoryFees.reduce((sum, fee) => sum + fee.amount, 0),
      others: this.otherFees.reduce((sum, fee) => sum + fee.amount, 0)
    },
    totalDue: this.totalDue,
    previousPayments: this.payments
      .filter((_, index) => index < paymentIndex)
      .reduce((sum, prev) => sum + prev.amount, 0),
    currentPayment: payment.amount,
    remainingBalance: this.remainingBalance,
    notes: payment.notes
  };
};

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
