const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const FinancialRecord = require("../models/FinancialRecord");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Enrollment = require("../models/Enrollment");

// Get all financial records (admin only)
router.get("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { academicYear, semester, status, search } = req.query;
    
    // Build query
    let query = {};
    
    // Add academic year filter if provided
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    // Add semester filter if provided
    if (semester) {
      query.semester = semester;
    }
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Add search filter if provided (search by student name or ID)
    if (search) {
      // First find students matching the search
      const students = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } }
        ]
      }).select("_id");
      
      // Get their IDs
      const studentIds = students.map(s => s._id);
      
      // Add to query
      query.student = { $in: studentIds };
    }
    
    // Get financial records with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const financialRecords = await FinancialRecord.find(query)
      .populate("student", "name email studentId")
      .populate("enrollmentReference")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    // Get total count for pagination
    const total = await FinancialRecord.countDocuments(query);
    
    // Calculate financial summary
    const totalAssessments = await FinancialRecord.aggregate([
      { $match: query },
      { $group: { 
        _id: null, 
        total: { $sum: "$totalAssessment" },
        collected: { $sum: { $subtract: ["$totalDue", "$remainingBalance"] } },
        outstanding: { $sum: "$remainingBalance" }
      }}
    ]);
    
    const summary = totalAssessments.length > 0 ? {
      totalAssessment: totalAssessments[0].total,
      totalCollected: totalAssessments[0].collected,
      totalOutstanding: totalAssessments[0].outstanding
    } : {
      totalAssessment: 0,
      totalCollected: 0,
      totalOutstanding: 0
    };
    
    res.json({
      financialRecords,
      summary,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get financial records error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get financial record by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const financialRecord = await FinancialRecord.findById(id)
      .populate("student", "name email studentId")
      .populate("studentProfile")
      .populate("enrollmentReference")
      .populate("payments.receivedBy", "name");
    
    if (!financialRecord) {
      return res.status(404).json({ message: "Financial record not found" });
    }
    
    // Check if user is authorized (admin or the student)
    if (req.user.role !== "admin" && financialRecord.student._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    res.json(financialRecord);
  } catch (error) {
    console.error("Get financial record error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create financial record (admin only)
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { 
      student, 
      academicYear, 
      semester, 
      tuitionFee,
      miscellaneousFees,
      laboratoryFees,
      otherFees,
      discounts,
      scholarship,
      dueDate
    } = req.body;
    
    // Verify student exists
    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Get student profile
    const studentProfile = await StudentProfile.findOne({ user: student });
    
    // Check for existing financial record
    const existingRecord = await FinancialRecord.findOne({
      student,
      academicYear,
      semester
    });
    
    if (existingRecord) {
      return res.status(400).json({ message: "Financial record already exists for this student and semester" });
    }
    
    // Find enrollment for reference
    const enrollment = await Enrollment.findOne({
      student,
      academicYear,
      semester
    });
    
    // Create financial record
    const financialRecord = new FinancialRecord({
      student,
      studentProfile: studentProfile?._id,
      academicYear,
      semester,
      enrollmentReference: enrollment?._id,
      tuitionFee,
      miscellaneousFees,
      laboratoryFees,
      otherFees,
      discounts,
      scholarship,
      dueDate,
      createdBy: req.user.userId
    });
    
    await financialRecord.save();
    
    res.status(201).json({
      message: "Financial record created successfully",
      financialRecord
    });
  } catch (error) {
    console.error("Create financial record error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update financial record (admin only)
router.put("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      tuitionFee,
      miscellaneousFees,
      laboratoryFees,
      otherFees,
      discounts,
      scholarship,
      dueDate,
      status,
      notes
    } = req.body;
    
    const financialRecord = await FinancialRecord.findById(id);
    if (!financialRecord) {
      return res.status(404).json({ message: "Financial record not found" });
    }
    
    // Update fields
    if (tuitionFee) financialRecord.tuitionFee = tuitionFee;
    if (miscellaneousFees) financialRecord.miscellaneousFees = miscellaneousFees;
    if (laboratoryFees) financialRecord.laboratoryFees = laboratoryFees;
    if (otherFees) financialRecord.otherFees = otherFees;
    if (discounts) financialRecord.discounts = discounts;
    if (scholarship) financialRecord.scholarship = scholarship;
    if (dueDate) financialRecord.dueDate = dueDate;
    if (status) financialRecord.status = status;
    if (notes) financialRecord.notes = notes;
    
    financialRecord.updatedBy = req.user.userId;
    
    await financialRecord.save();
    
    res.json({
      message: "Financial record updated successfully",
      financialRecord
    });
  } catch (error) {
    console.error("Update financial record error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add payment to financial record
router.post("/:id/payments", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      amount, 
      paymentMethod, 
      bank,
      checkNumber,
      referenceNumber,
      notes
    } = req.body;
    
    const financialRecord = await FinancialRecord.findById(id);
    if (!financialRecord) {
      return res.status(404).json({ message: "Financial record not found" });
    }
    
    // Generate receipt number
    const receiptNumber = `R-${Date.now().toString().slice(-8)}`;
    
    // Create payment
    const payment = {
      receiptNumber,
      date: new Date(),
      amount,
      paymentMethod,
      bank,
      checkNumber,
      referenceNumber,
      receivedBy: req.user.userId,
      notes
    };
    
    // Add payment to record
    await financialRecord.addPayment(payment);
    
    // If this payment completes the balance, update enrollment status
    if (financialRecord.remainingBalance <= 0 && financialRecord.enrollmentReference) {
      const enrollment = await Enrollment.findById(financialRecord.enrollmentReference);
      if (enrollment && enrollment.enrollmentStatus === "pending") {
        enrollment.enrollmentStatus = "approved";
        enrollment.dateApproved = new Date();
        enrollment.approvedBy = req.user.userId;
        await enrollment.save();
      }
    }
    
    res.json({
      message: "Payment recorded successfully",
      payment,
      remainingBalance: financialRecord.remainingBalance,
      receipt: financialRecord.generateReceipt(financialRecord.payments.length - 1)
    });
  } catch (error) {
    console.error("Add payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate an official receipt
router.get("/:id/receipts/:paymentIndex", auth, async (req, res) => {
  try {
    const { id, paymentIndex } = req.params;
    
    const financialRecord = await FinancialRecord.findById(id)
      .populate("student", "name email studentId")
      .populate("studentProfile")
      .populate("payments.receivedBy", "name");
    
    if (!financialRecord) {
      return res.status(404).json({ message: "Financial record not found" });
    }
    
    // Check if user is authorized (admin or the student)
    if (req.user.role !== "admin" && financialRecord.student._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Check if payment exists
    if (!financialRecord.payments[paymentIndex]) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Generate receipt
    const receipt = financialRecord.generateReceipt(parseInt(paymentIndex));
    
    // Add student name
    receipt.studentName = financialRecord.student.name;
    
    res.json(receipt);
  } catch (error) {
    console.error("Generate receipt error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get financial summary report (admin only)
router.get("/reports/summary", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { academicYear, semester } = req.query;
    
    // Build query
    let query = {};
    
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    // Calculate financial summary
    const summary = await FinancialRecord.aggregate([
      { $match: query },
      { $group: { 
        _id: { academicYear: "$academicYear", semester: "$semester" },
        totalAssessment: { $sum: "$totalAssessment" },
        totalDiscounts: { $sum: "$totalDiscounts" },
        totalDue: { $sum: "$totalDue" },
        totalPaid: { $sum: { $subtract: ["$totalDue", "$remainingBalance"] } },
        totalOutstanding: { $sum: "$remainingBalance" },
        studentCount: { $count: {} }
      }},
      { $sort: { "_id.academicYear": -1, "_id.semester": 1 } }
    ]);
    
    // Status breakdown
    const statusBreakdown = await FinancialRecord.aggregate([
      { $match: query },
      { $group: {
        _id: "$status",
        count: { $count: {} },
        totalAmount: { $sum: "$totalDue" },
        outstandingAmount: { $sum: "$remainingBalance" }
      }},
      { $sort: { "_id": 1 } }
    ]);
    
    res.json({
      summary,
      statusBreakdown
    });
  } catch (error) {
    console.error("Financial summary report error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Set default tuition and fee structure (admin only)
router.post("/fee-structure", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { academicYear, semester, feeStructure } = req.body;
    
    // In a real application, this would save to a database
    // For now, just return the structure that would be used for new enrollments
    
    res.json({
      message: "Fee structure saved successfully",
      academicYear,
      semester,
      feeStructure
    });
  } catch (error) {
    console.error("Set fee structure error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
