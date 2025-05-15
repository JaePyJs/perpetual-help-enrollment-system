const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const Enrollment = require("../models/Enrollment");
const Subject = require("../models/Subject");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const AcademicYear = require("../models/AcademicYear");
const FinancialRecord = require("../models/FinancialRecord");
const Department = require("../models/Department");

// Get all enrollments (filtered by role and query parameters)
router.get("/", auth, async (req, res) => {
  try {
    const { academicYear, semester, department, status, search } = req.query;
    
    // Build base query
    let query = {};
    
    // Add academic year filter if provided
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    // Add semester filter if provided
    if (semester) {
      query.semester = semester;
    }
    
    // Add department filter if provided
    if (department) {
      query.department = department;
    }
    
    // Add status filter if provided
    if (status) {
      query.enrollmentStatus = status;
    }
    
    // Role-based filtering
    if (req.user.role === "student") {
      // Students can only see their own enrollments
      query.student = req.user.userId;
    } else if (req.user.role === "teacher") {
      // Teachers can see enrollments for classes they teach
      // First find subjects where this teacher is assigned
      const teacherSubjects = await Subject.find({ 
        'subjects.teacher': req.user.userId 
      }).select('_id');
      
      const subjectIds = teacherSubjects.map(subject => subject._id);
      
      // Then find enrollments with these subjects
      query['subjects.subject'] = { $in: subjectIds };
    }
    // Admins can see all enrollments (no additional filter needed)
    
    // Add search filter if provided
    if (search) {
      // Find students matching search
      const students = await User.find({
        role: "student",
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } }
        ]
      }).select("_id");
      
      query.student = { $in: students.map(s => s._id) };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const enrollments = await Enrollment.find(query)
      .populate("student", "name email studentId")
      .populate("studentProfile")
      .populate("subjects.subject")
      .populate("subjects.teacher", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    // Get total count for pagination
    const total = await Enrollment.countDocuments(query);
    
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

// Get enrollment by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const enrollment = await Enrollment.findById(id)
      .populate("student", "name email studentId")
      .populate("studentProfile")
      .populate("subjects.subject")
      .populate("subjects.teacher", "name email")
      .populate("approvedBy", "name")
      .populate("rejectedBy", "name");
    
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    // Check authorization
    if (req.user.role === "student" && enrollment.student._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get financial record associated with this enrollment
    const financialRecord = await FinancialRecord.findOne({
      student: enrollment.student._id,
      academicYear: enrollment.academicYear,
      semester: enrollment.semester
    });
    
    res.json({
      enrollment,
      financialRecord
    });
  } catch (error) {
    console.error("Get enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create enrollment
router.post("/", auth, async (req, res) => {
  try {
    const { 
      academicYear, 
      semester, 
      subjects 
    } = req.body;
    
    // Check if enrollment is open
    const enrollmentStatus = await AcademicYear.isEnrollmentOpen();
    if (!enrollmentStatus.open) {
      return res.status(400).json({ message: "Enrollment is currently closed" });
    }
    
    // Verify student exists
    const student = await User.findById(req.user.userId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Only students can enroll" });
    }
    
    // Get student profile
    const profile = await StudentProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    // Check if student is already enrolled in this semester
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
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
      student: req.user.userId,
      studentProfile: profile._id,
      academicYear,
      semester,
      yearLevel: student.yearLevel,
      department: student.department,
      program: profile.program || student.department,
      subjects: subjects.map(s => ({
        subject: s.subject,
        section: s.section
      })),
      enrollmentStatus: "pending",
      dateSubmitted: new Date()
    });
    
    await enrollment.save();
    
    // Calculate fees
    let tuitionFee = 0;
    let labFees = 0;
    
    // Simple fee calculation based on number of subjects
    tuitionFee = validSubjects.reduce((sum, subject) => sum + (subject.units?.total || 3) * 1000, 0);
    
    // Add lab fees for subjects with laboratory units
    labFees = validSubjects.reduce((sum, subject) => {
      return sum + (subject.units?.laboratory > 0 ? subject.units.laboratory * 500 : 0);
    }, 0);
    
    // Create financial record
    const financialRecord = new FinancialRecord({
      student: req.user.userId,
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
    console.error("Create enrollment error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update enrollment status (admin only)
router.patch("/:id/status", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, notes } = req.body;
    
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    // Update status
    enrollment.enrollmentStatus = status;
    
    // Update tracking fields based on status
    if (status === "approved") {
      enrollment.dateApproved = new Date();
      enrollment.approvedBy = req.user.userId;
    } else if (status === "rejected") {
      enrollment.dateRejected = new Date();
      enrollment.rejectedBy = req.user.userId;
      enrollment.rejectionReason = rejectionReason;
    }
    
    if (notes) {
      enrollment.notes = notes;
    }
    
    await enrollment.save();
    
    res.json({
      message: `Enrollment ${status} successfully`,
      enrollment
    });
  } catch (error) {
    console.error("Update enrollment status error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Add/Drop subjects
router.patch("/:id/subjects", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { addSubjects, dropSubjects } = req.body;
    
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    // Check if user is authorized
    if (req.user.role === "student" && enrollment.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Check if enrollment is in a status that allows changes
    if (enrollment.enrollmentStatus !== "approved" && req.user.role !== "admin") {
      return res.status(400).json({ 
        message: "Cannot modify subjects. Enrollment must be approved first" 
      });
    }
    
    // Check if academic calendar allows add/drop
    const currentYear = await AcademicYear.getCurrentAcademicYear();
    const currentSemester = currentYear?.semesters.find(s => s.name === enrollment.semester);
    
    if (!currentSemester || !currentSemester.addDropPeriod) {
      return res.status(400).json({ message: "Add/Drop period not defined" });
    }
    
    const now = new Date();
    const addDropStart = new Date(currentSemester.addDropPeriod.start);
    const addDropEnd = new Date(currentSemester.addDropPeriod.end);
    
    if ((now < addDropStart || now > addDropEnd) && req.user.role !== "admin") {
      return res.status(400).json({ 
        message: "Add/Drop period is not currently active" 
      });
    }
    
    // Process dropped subjects
    if (dropSubjects && dropSubjects.length > 0) {
      // Update subject status to dropped
      for (const subjectId of dropSubjects) {
        const subjectIndex = enrollment.subjects.findIndex(
          s => s.subject.toString() === subjectId
        );
        
        if (subjectIndex !== -1) {
          enrollment.subjects[subjectIndex].status = "dropped";
          enrollment.subjects[subjectIndex].remarks = "Dropped during add/drop period";
        }
      }
    }
    
    // Process added subjects
    if (addSubjects && addSubjects.length > 0) {
      // Get student info
      const student = await User.findById(enrollment.student);
      
      // Verify all subjects exist and belong to student's department
      const validSubjects = await Subject.find({
        _id: { $in: addSubjects.map(s => s.subject) },
        department: student.department
      });
      
      if (validSubjects.length !== addSubjects.length) {
        return res.status(400).json({ message: "One or more subjects are invalid" });
      }
      
      // Add the new subjects
      for (const subject of addSubjects) {
        enrollment.subjects.push({
          subject: subject.subject,
          section: subject.section,
          status: "enrolled",
          remarks: "Added during add/drop period"
        });
      }
      
      // Update financial record if needed
      const financialRecord = await FinancialRecord.findOne({
        student: enrollment.student,
        academicYear: enrollment.academicYear,
        semester: enrollment.semester
      });
      
      if (financialRecord) {
        // Recalculate tuition based on new subjects
        const allActiveSubjects = enrollment.subjects.filter(
          s => s.status === "enrolled"
        );
        
        const subjectIds = allActiveSubjects.map(s => s.subject);
        const allSubjectDetails = await Subject.find({ _id: { $in: subjectIds } });
        
        // Update tuition fee
        const totalUnits = allSubjectDetails.reduce(
          (sum, subject) => sum + (subject.units?.total || 3), 0
        );
        
        financialRecord.tuitionFee.totalUnits = totalUnits;
        financialRecord.tuitionFee.total = financialRecord.tuitionFee.perUnitFee * totalUnits;
        
        // Update lab fees
        financialRecord.laboratoryFees = allSubjectDetails
          .filter(subject => subject.units?.laboratory > 0)
          .map(subject => ({
            subjectCode: subject.code,
            amount: subject.units.laboratory * 500
          }));
        
        await financialRecord.save();
      }
    }
    
    await enrollment.save();
    
    res.json({
      message: "Subjects updated successfully",
      enrollment
    });
  } catch (error) {
    console.error("Update subjects error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get available subjects for enrollment
router.get("/available-subjects", auth, checkRole(["student"]), async (req, res) => {
  try {
    const { academicYear, semester } = req.query;
    
    // Get student info
    const student = await User.findById(req.user.userId).select("-password");
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Get subjects for the student's department and year level
    const subjects = await Subject.find({
      department: student.department,
      yearLevel: student.yearLevel,
      semester,
      status: "active"
    }).populate('prerequisites', 'code title');
    
    // Check which subjects the student is eligible for based on prerequisites
    const eligibleSubjects = [];
    
    for (const subject of subjects) {
      const isEligible = await subject.checkPrerequisites(req.user.userId);
      
      if (isEligible) {
        eligibleSubjects.push({
          ...subject._doc,
          isEligible
        });
      }
    }
    
    res.json(eligibleSubjects);
  } catch (error) {
    console.error("Get available subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get enrollment statistics (admin only)
router.get("/stats/summary", auth, checkRole(["admin"]), async (req, res) => {
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
    
    // Status breakdown
    const statusStats = await Enrollment.aggregate([
      { $match: query },
      { $group: {
        _id: "$enrollmentStatus",
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    
    // Department breakdown
    const departmentStats = await Enrollment.aggregate([
      { $match: query },
      { $group: {
        _id: "$department",
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    
    // Year level breakdown
    const yearLevelStats = await Enrollment.aggregate([
      { $match: query },
      { $group: {
        _id: "$yearLevel",
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    
    // Get total enrollments
    const totalEnrollments = await Enrollment.countDocuments(query);
    
    res.json({
      total: totalEnrollments,
      byStatus: statusStats,
      byDepartment: departmentStats,
      byYearLevel: yearLevelStats
    });
  } catch (error) {
    console.error("Enrollment stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
