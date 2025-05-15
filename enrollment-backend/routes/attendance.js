const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { auth, checkRole } = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Subject = require("../models/Subject");
const AcademicYear = require("../models/AcademicYear");

/**
 * @route   POST /api/attendance
 * @desc    Create a new attendance record
 * @access  Private (Teachers and Admins only)
 */
router.post("/", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const {
      course,
      date,
      academicYear,
      sessionType,
      sessionNumber,
      duration,
      records,
      notes
    } = req.body;

    // Validate that the course exists
    const courseExists = await Subject.findById(course);
    if (!courseExists) {
      return res.status(400).json({ message: "Course not found" });
    }

    // Validate that the academic year exists
    const academicYearExists = await AcademicYear.findById(academicYear);
    if (!academicYearExists) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    // Create new attendance record
    const attendance = new Attendance({
      course,
      teacher: req.user.id,
      date: new Date(date),
      academicYear,
      sessionType,
      sessionNumber,
      duration,
      records,
      notes
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error creating attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/attendance/course/:courseId
 * @desc    Get all attendance records for a course
 * @access  Private (Teachers and Admins only)
 */
router.get("/course/:courseId", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { academicYear } = req.query;

    let query = { course: courseId };
    
    // Add academic year filter if provided
    if (academicYear) {
      query.academicYear = academicYear;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("teacher", "name")
      .populate("course", "name code")
      .populate("academicYear", "year term")
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/attendance/:id
 * @desc    Get a specific attendance record by ID
 * @access  Private (Teachers and Admins only)
 */
router.get("/:id", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("teacher", "name")
      .populate("course", "name code")
      .populate("academicYear", "year term")
      .populate("records.student", "name studentId");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/attendance/:id
 * @desc    Update an attendance record
 * @access  Private (Teachers and Admins only)
 */
router.put("/:id", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const {
      date,
      sessionType,
      sessionNumber,
      duration,
      records,
      notes
    } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check if the teacher is the one who created the record or is an admin
    if (attendance.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this attendance record" });
    }

    // Update fields
    if (date) attendance.date = new Date(date);
    if (sessionType) attendance.sessionType = sessionType;
    if (sessionNumber) attendance.sessionNumber = sessionNumber;
    if (duration) attendance.duration = duration;
    if (records) attendance.records = records;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/attendance/:id
 * @desc    Delete an attendance record
 * @access  Private (Teachers and Admins only)
 */
router.delete("/:id", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check if the teacher is the one who created the record or is an admin
    if (attendance.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this attendance record" });
    }

    await attendance.remove();
    res.json({ message: "Attendance record deleted" });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/attendance/student/:studentId
 * @desc    Get all attendance records for a student
 * @access  Private
 */
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, course } = req.query;

    // Find the user by studentId
    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check authorization - only the student, teachers, or admins can view
    if (
      req.user.id !== student._id.toString() &&
      !["teacher", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized to view this student's attendance" });
    }

    // Build the query
    let query = { "records.student": student._id };
    
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    if (course) {
      query.course = course;
    }

    // Find all attendance records where this student is included
    const attendanceRecords = await Attendance.find(query)
      .populate("course", "name code")
      .populate("academicYear", "year term")
      .sort({ date: -1 });

    // Process records to only include this student's data
    const processedRecords = attendanceRecords.map(record => {
      // Find this student's specific attendance entry
      const studentRecord = record.records.find(
        r => r.student.toString() === student._id.toString()
      );
      
      return {
        _id: record._id,
        course: record.course,
        date: record.date,
        academicYear: record.academicYear,
        sessionType: record.sessionType,
        sessionNumber: record.sessionNumber,
        status: studentRecord ? studentRecord.status : "unknown",
        minutesLate: studentRecord ? studentRecord.minutesLate : 0,
        notes: studentRecord ? studentRecord.notes : ""
      };
    });

    res.json(processedRecords);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/attendance/report/course/:courseId
 * @desc    Get attendance report for a course
 * @access  Private (Teachers and Admins only)
 */
router.get("/report/course/:courseId", auth, checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { academicYear } = req.query;

    let query = { course: courseId };
    if (academicYear) {
      query.academicYear = academicYear;
    }

    // Get all attendance records for the course
    const attendanceRecords = await Attendance.find(query)
      .populate("records.student", "name studentId")
      .sort({ date: 1 });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this course" });
    }

    // Get all unique students across all attendance records
    const studentsMap = new Map();
    
    attendanceRecords.forEach(record => {
      record.records.forEach(studentRecord => {
        if (!studentsMap.has(studentRecord.student._id.toString())) {
          studentsMap.set(studentRecord.student._id.toString(), {
            _id: studentRecord.student._id,
            name: studentRecord.student.name,
            studentId: studentRecord.student.studentId,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            totalSessions: 0,
            attendancePercentage: 0
          });
        }
        
        // Update counts based on status
        const studentStats = studentsMap.get(studentRecord.student._id.toString());
        studentStats[studentRecord.status]++;
        studentStats.totalSessions++;
      });
    });

    // Calculate attendance percentages
    for (const [, student] of studentsMap) {
      student.attendancePercentage = ((student.present + student.late) / student.totalSessions) * 100;
    }

    // Convert map to array and sort by name
    const report = Array.from(studentsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      courseId,
      totalSessions: attendanceRecords.length,
      reportDate: new Date(),
      students: report
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
