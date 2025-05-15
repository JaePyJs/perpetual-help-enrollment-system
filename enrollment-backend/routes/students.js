const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Enrollment = require("../models/Enrollment");
const Subject = require("../models/Subject");
const FinancialRecord = require("../models/FinancialRecord");
const Department = require("../models/Department");
const AcademicYear = require("../models/AcademicYear");

// Get all students (admin only)
router.get("/", auth, checkRole(["admin", "teacher"]), async (req, res) => {
  try {
    const { department, yearLevel, search } = req.query;
    
    // Build query
    let query = { role: "student" };
    
    // Add department filter if provided
    if (department) {
      query.department = department;
    }
    
    // Add year level filter if provided
    if (yearLevel) {
      query.yearLevel = parseInt(yearLevel);
    }
    
    // Add search filter if provided
    if (search) {
      // Search in name, email, or studentId
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } }
      ];
    }
    
    // Get students with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const students = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new student (admin only)
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { name, department, yearLevel, section } = req.body;
    
    // Check if department exists
    const departmentExists = await Department.findOne({ code: department });
    if (!departmentExists) {
      return res.status(400).json({ message: "Department not found" });
    }
    
    // Create user account first with default password
    const newUser = new User({
      name,
      role: "student",
      department,
      yearLevel,
      section,
      password: "123", // Default password as specified in requirements
      passwordResetRequired: true
    });
    
    await newUser.save();
    
    // Generate student ID
    const studentId = await StudentProfile.generateStudentId(department);
    
    // Create student profile
    const studentProfile = new StudentProfile({
      user: newUser._id,
      studentId,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" "),
      department,
      yearLevel,
      enrollmentDate: new Date()
    });
    
    await studentProfile.save();
    
    // Update user with generated email
    newUser.email = studentProfile.generateEmail();
    newUser.studentId = studentId;
    await newUser.save();
    
    res.status(201).json({
      message: "Student created successfully",
      student: {
        id: newUser._id,
        name: newUser.name,
        studentId,
        email: newUser.email,
        department,
        yearLevel
      }
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get student by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Allow access only to admin, the student themselves, or their teachers
    if (req.user.role !== "admin" && req.user.userId !== id && req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get user without password
    const student = await User.findById(id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Get student profile
    const profile = await StudentProfile.findOne({ user: id });
    
    // Get current enrollments
    const currentYear = await AcademicYear.getCurrentAcademicYear();
    const currentSemester = await AcademicYear.getCurrentSemester();
    
    let currentEnrollment = null;
    if (currentYear && currentSemester) {
      currentEnrollment = await Enrollment.findOne({
        student: id,
        academicYear: currentYear.name,
        semester: currentSemester.name
      }).populate("subjects.subject");
    }
    
    // Get financial records
    const financialRecords = await FinancialRecord.findOne({
      student: id,
      academicYear: currentYear?.name,
      semester: currentSemester?.name
    });
    
    res.json({
      student,
      profile,
      currentEnrollment,
      financialRecord: financialRecords
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update student profile
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactNumber, address, section } = req.body;
    
    // Only admin or the student themselves can update profile
    if (req.user.role !== "admin" && req.user.userId !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Find and update user
    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Update user fields
    if (name) student.name = name;
    if (contactNumber) student.contactNumber = contactNumber;
    if (address) student.address = address;
    if (section) student.section = section;
    
    student.updatedAt = new Date();
    await student.save();
    
    // Update profile if it exists
    const profile = await StudentProfile.findOne({ user: id });
    if (profile) {
      if (name) {
        const nameParts = name.split(" ");
        profile.firstName = nameParts[0];
        profile.lastName = nameParts.slice(1).join(" ");
      }
      
      await profile.save();
    }
    
    res.json({ message: "Profile updated successfully", student });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Enroll in courses/subjects
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { academicYear, semester, subjects } = req.body;
    
    // Only admin or the student themselves can enroll
    if (req.user.role !== "admin" && req.user.userId !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Verify student exists
    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Get student profile
    const profile = await StudentProfile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    // Check if enrollment is open
    const enrollmentStatus = await AcademicYear.isEnrollmentOpen();
    if (!enrollmentStatus.open) {
      return res.status(400).json({ message: "Enrollment is currently closed" });
    }
    
    // Check if student is already enrolled in this semester
    const existingEnrollment = await Enrollment.findOne({
      student: id,
      academicYear,
      semester
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled for this semester" });
    }
    
    // Verify all subjects exist and belong to student's department
    const subjectIds = subjects.map(s => s.subject);
    const validSubjects = await Subject.find({
      _id: { $in: subjectIds },
      department: student.department
    });
    
    if (validSubjects.length !== subjectIds.length) {
      return res.status(400).json({ message: "One or more subjects are invalid" });
    }
    
    // Create enrollment record
    const enrollment = new Enrollment({
      student: id,
      studentProfile: profile._id,
      academicYear,
      semester,
      yearLevel: student.yearLevel,
      department: student.department,
      program: profile.program || student.department, // Use program from profile or default to department
      subjects: subjects.map(s => ({
        subject: s.subject,
        section: s.section
      })),
      enrollmentStatus: "pending"
    });
    
    await enrollment.save();
    
    // Calculate fees
    let tuitionFee = 0;
    let labFees = 0;
    
    // Simple fee calculation based on number of subjects
    // In a real system, this would be more complex
    tuitionFee = validSubjects.reduce((sum, subject) => sum + (subject.units?.total || 3) * 1000, 0);
    
    // Add lab fees for subjects with laboratory units
    labFees = validSubjects.reduce((sum, subject) => {
      return sum + (subject.units?.laboratory > 0 ? subject.units.laboratory * 500 : 0);
    }, 0);
    
    // Create financial record
    const financialRecord = new FinancialRecord({
      student: id,
      studentProfile: profile._id,
      academicYear,
      semester,
      enrollmentReference: enrollment._id,
      tuitionFee: {
        baseFee: 0,
        perUnitFee: 1000,
        totalUnits: validSubjects.reduce((sum, subject) => sum + (subject.units?.total || 3), 0),
        total: tuitionFee
      },
      miscellaneousFees: [
        {
          name: "Registration Fee",
          amount: 500,
          description: "One-time registration fee per semester"
        },
        {
          name: "Library Fee",
          amount: 300,
          description: "Access to library resources"
        },
        {
          name: "Computer Fee",
          amount: 500,
          description: "Access to computer laboratories"
        }
      ],
      laboratoryFees: validSubjects
        .filter(subject => subject.units?.laboratory > 0)
        .map(subject => ({
          subjectCode: subject.code,
          amount: subject.units.laboratory * 500
        }))
    });
    
    await financialRecord.save();
    
    res.status(201).json({
      message: "Enrollment submitted successfully",
      enrollment,
      financialRecord
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get student enrollment history
router.get("/:id/enrollments", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admin, the student themselves, or their teachers can access
    if (req.user.role !== "admin" && req.user.userId !== id && req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get enrollments with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const enrollments = await Enrollment.find({ student: id })
      .sort({ academicYear: -1, semester: -1 })
      .skip(skip)
      .limit(limit)
      .populate("subjects.subject");
      
    // Get total count for pagination
    const total = await Enrollment.countDocuments({ student: id });
    
    res.json({
      enrollments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get student financial records
router.get("/:id/finances", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admin, the student themselves can access financial records
    if (req.user.role !== "admin" && req.user.userId !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get financial records with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const financialRecords = await FinancialRecord.find({ student: id })
      .sort({ academicYear: -1, semester: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const total = await FinancialRecord.countDocuments({ student: id });
    
    res.json({
      financialRecords,
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

// Record payment for a student
router.post("/:id/payments", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      academicYear, 
      semester, 
      amount, 
      paymentMethod, 
      referenceNumber,
      notes 
    } = req.body;
    
    // Find financial record
    const financialRecord = await FinancialRecord.findOne({
      student: id,
      academicYear,
      semester
    });
    
    if (!financialRecord) {
      return res.status(404).json({ message: "Financial record not found" });
    }
    
    // Generate receipt number
    const receiptNumber = `R-${Date.now().toString().slice(-6)}`;
    
    // Add payment
    const payment = {
      receiptNumber,
      date: new Date(),
      amount,
      paymentMethod,
      referenceNumber,
      receivedBy: req.user.userId,
      notes
    };
    
    await financialRecord.addPayment(payment);
    
    // If this payment completes the balance, update enrollment status
    if (financialRecord.remainingBalance <= 0) {
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
      currentBalance: financialRecord.remainingBalance
    });
  } catch (error) {
    console.error("Record payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
