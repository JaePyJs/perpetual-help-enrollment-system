const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const AcademicYear = require("../models/AcademicYear");

// Get all academic years
router.get("/years", async (req, res) => {
  try {
    const academicYears = await AcademicYear.find()
      .sort({ startDate: -1 });
    
    res.json(academicYears);
  } catch (error) {
    console.error("Get academic years error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current academic year and semester
router.get("/current", async (req, res) => {
  try {
    const currentYear = await AcademicYear.getCurrentAcademicYear();
    const currentSemester = await AcademicYear.getCurrentSemester();
    
    if (!currentYear) {
      return res.status(404).json({ message: "No active academic year found" });
    }
    
    res.json({
      academicYear: currentYear,
      currentSemester,
      isEnrollmentOpen: await AcademicYear.isEnrollmentOpen()
    });
  } catch (error) {
    console.error("Get current academic year error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create academic year (admin only)
router.post("/years", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { 
      name, 
      startDate, 
      endDate, 
      semesters,
      isCurrentYear
    } = req.body;
    
    // Check if academic year with this name already exists
    const existingYear = await AcademicYear.findOne({ name });
    if (existingYear) {
      return res.status(400).json({ message: "Academic year with this name already exists" });
    }
    
    const newAcademicYear = new AcademicYear({
      name,
      startDate,
      endDate,
      semesters,
      isCurrentYear: isCurrentYear || false
    });
    
    await newAcademicYear.save();
    
    res.status(201).json({
      message: "Academic year created successfully",
      academicYear: newAcademicYear
    });
  } catch (error) {
    console.error("Create academic year error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update academic year (admin only)
router.put("/years/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      startDate, 
      endDate, 
      semesters,
      isCurrentYear,
      status
    } = req.body;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    // Update fields
    if (name) academicYear.name = name;
    if (startDate) academicYear.startDate = startDate;
    if (endDate) academicYear.endDate = endDate;
    if (semesters) academicYear.semesters = semesters;
    if (isCurrentYear !== undefined) academicYear.isCurrentYear = isCurrentYear;
    if (status) academicYear.status = status;
    
    await academicYear.save();
    
    res.json({
      message: "Academic year updated successfully",
      academicYear
    });
  } catch (error) {
    console.error("Update academic year error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add semester to academic year (admin only)
router.post("/years/:id/semesters", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      startDate, 
      endDate, 
      enrollmentPeriod,
      lateEnrollmentPeriod,
      addDropPeriod,
      midtermPeriod,
      finalsPeriod,
      gradeSubmissionDeadline,
      holidayBreaks
    } = req.body;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    // Check if semester already exists
    const semesterExists = academicYear.semesters.some(s => s.name === name);
    if (semesterExists) {
      return res.status(400).json({ message: "Semester already exists for this academic year" });
    }
    
    // Add new semester
    academicYear.semesters.push({
      name,
      startDate,
      endDate,
      enrollmentPeriod,
      lateEnrollmentPeriod,
      addDropPeriod,
      midtermPeriod,
      finalsPeriod,
      gradeSubmissionDeadline,
      holidayBreaks: holidayBreaks || []
    });
    
    await academicYear.save();
    
    res.status(201).json({
      message: "Semester added successfully",
      semester: academicYear.semesters[academicYear.semesters.length - 1]
    });
  } catch (error) {
    console.error("Add semester error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update semester (admin only)
router.put("/years/:id/semesters/:semesterName", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id, semesterName } = req.params;
    const { 
      startDate, 
      endDate, 
      enrollmentPeriod,
      lateEnrollmentPeriod,
      addDropPeriod,
      midtermPeriod,
      finalsPeriod,
      gradeSubmissionDeadline,
      holidayBreaks,
      status
    } = req.body;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    // Find semester index
    const semesterIndex = academicYear.semesters.findIndex(s => s.name === semesterName);
    if (semesterIndex === -1) {
      return res.status(404).json({ message: "Semester not found" });
    }
    
    const semester = academicYear.semesters[semesterIndex];
    
    // Update fields
    if (startDate) semester.startDate = startDate;
    if (endDate) semester.endDate = endDate;
    if (enrollmentPeriod) semester.enrollmentPeriod = enrollmentPeriod;
    if (lateEnrollmentPeriod) semester.lateEnrollmentPeriod = lateEnrollmentPeriod;
    if (addDropPeriod) semester.addDropPeriod = addDropPeriod;
    if (midtermPeriod) semester.midtermPeriod = midtermPeriod;
    if (finalsPeriod) semester.finalsPeriod = finalsPeriod;
    if (gradeSubmissionDeadline) semester.gradeSubmissionDeadline = gradeSubmissionDeadline;
    if (holidayBreaks) semester.holidayBreaks = holidayBreaks;
    if (status) semester.status = status;
    
    await academicYear.save();
    
    res.json({
      message: "Semester updated successfully",
      semester: academicYear.semesters[semesterIndex]
    });
  } catch (error) {
    console.error("Update semester error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create default academic year with semesters (admin only)
router.post("/init-default", auth, checkRole(["admin"]), async (req, res) => {
  try {
    // Check if academic years already exist
    const existingCount = await AcademicYear.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ 
        message: "Academic years are already initialized",
        count: existingCount
      });
    }
    
    // Get the current year and create academic year for it
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const defaultAcademicYear = new AcademicYear({
      name: `${currentYear}-${currentYear + 1}`,
      startDate: new Date(`${currentYear}-06-01`), // June 1st
      endDate: new Date(`${currentYear + 1}-05-31`), // May 31st next year
      isCurrentYear: true,
      status: "ongoing",
      semesters: [
        {
          name: "1st",
          startDate: new Date(`${currentYear}-06-01`), // June 1st
          endDate: new Date(`${currentYear}-10-31`), // October 31st
          enrollmentPeriod: {
            start: new Date(`${currentYear}-05-15`), // May 15th
            end: new Date(`${currentYear}-06-15`) // June 15th
          },
          lateEnrollmentPeriod: {
            start: new Date(`${currentYear}-06-16`), // June 16th
            end: new Date(`${currentYear}-06-30`), // June 30th
            penaltyFee: 500
          },
          addDropPeriod: {
            start: new Date(`${currentYear}-06-16`), // June 16th
            end: new Date(`${currentYear}-07-15`) // July 15th
          },
          midtermPeriod: {
            start: new Date(`${currentYear}-08-01`), // August 1st
            end: new Date(`${currentYear}-08-15`) // August 15th
          },
          finalsPeriod: {
            start: new Date(`${currentYear}-10-15`), // October 15th
            end: new Date(`${currentYear}-10-31`) // October 31st
          },
          gradeSubmissionDeadline: new Date(`${currentYear}-11-15`), // November 15th
          status: "ongoing"
        },
        {
          name: "2nd",
          startDate: new Date(`${currentYear}-11-15`), // November 15th
          endDate: new Date(`${currentYear + 1}-03-31`), // March 31st next year
          enrollmentPeriod: {
            start: new Date(`${currentYear}-10-15`), // October 15th
            end: new Date(`${currentYear}-11-30`) // November 30th
          },
          lateEnrollmentPeriod: {
            start: new Date(`${currentYear}-12-01`), // December 1st
            end: new Date(`${currentYear}-12-15`), // December 15th
            penaltyFee: 500
          },
          addDropPeriod: {
            start: new Date(`${currentYear}-12-01`), // December 1st
            end: new Date(`${currentYear}-12-31`) // December 31st
          },
          midtermPeriod: {
            start: new Date(`${currentYear + 1}-01-15`), // January 15th next year
            end: new Date(`${currentYear + 1}-01-31`) // January 31st next year
          },
          finalsPeriod: {
            start: new Date(`${currentYear + 1}-03-15`), // March 15th next year
            end: new Date(`${currentYear + 1}-03-31`) // March 31st next year
          },
          gradeSubmissionDeadline: new Date(`${currentYear + 1}-04-15`), // April 15th next year
          status: "pending"
        },
        {
          name: "Summer",
          startDate: new Date(`${currentYear + 1}-04-15`), // April 15th next year
          endDate: new Date(`${currentYear + 1}-05-31`), // May 31st next year
          enrollmentPeriod: {
            start: new Date(`${currentYear + 1}-04-01`), // April 1st next year
            end: new Date(`${currentYear + 1}-04-15`) // April 15th next year
          },
          lateEnrollmentPeriod: {
            start: new Date(`${currentYear + 1}-04-16`), // April 16th next year
            end: new Date(`${currentYear + 1}-04-20`), // April 20th next year
            penaltyFee: 300
          },
          addDropPeriod: {
            start: new Date(`${currentYear + 1}-04-16`), // April 16th next year
            end: new Date(`${currentYear + 1}-04-25`) // April 25th next year
          },
          midtermPeriod: {
            start: new Date(`${currentYear + 1}-05-01`), // May 1st next year
            end: new Date(`${currentYear + 1}-05-07`) // May 7th next year
          },
          finalsPeriod: {
            start: new Date(`${currentYear + 1}-05-25`), // May 25th next year
            end: new Date(`${currentYear + 1}-05-31`) // May 31st next year
          },
          gradeSubmissionDeadline: new Date(`${currentYear + 1}-06-07`), // June 7th next year
          status: "pending"
        }
      ]
    });
    
    await defaultAcademicYear.save();
    
    res.status(201).json({
      message: "Default academic year initialized successfully",
      academicYear: defaultAcademicYear
    });
  } catch (error) {
    console.error("Init academic year error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check enrollment status
router.get("/enrollment-status", async (req, res) => {
  try {
    const enrollmentStatus = await AcademicYear.isEnrollmentOpen();
    
    const currentYear = await AcademicYear.getCurrentAcademicYear();
    const currentSemester = await AcademicYear.getCurrentSemester();
    
    res.json({
      isOpen: enrollmentStatus.open,
      isLate: enrollmentStatus.isLate,
      penaltyFee: enrollmentStatus.penaltyFee || 0,
      academicYear: currentYear?.name,
      semester: currentSemester?.name,
      periodDetails: currentSemester ? {
        enrollmentPeriod: currentSemester.enrollmentPeriod,
        lateEnrollmentPeriod: currentSemester.lateEnrollmentPeriod
      } : null
    });
  } catch (error) {
    console.error("Check enrollment status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
