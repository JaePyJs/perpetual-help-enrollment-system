const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

// Get teacher stats
router.get("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const activeCourses = await Course.countDocuments({
      teacher: req.user.userId,
    });
    const enrollments = await Enrollment.find({
      course: {
        $in: await Course.find({ teacher: req.user.userId }).distinct("_id"),
      },
    });
    const totalStudents = new Set(enrollments.map((e) => e.student.toString()))
      .size;
    const pendingGrades = await Enrollment.countDocuments({
      course: {
        $in: await Course.find({ teacher: req.user.userId }).distinct("_id"),
      },
      finalGrade: { $exists: false },
    });

    res.json({
      activeCourses,
      totalStudents,
      pendingGrades,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get teacher's courses
router.get("/courses", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const courses = await Course.find({ teacher: req.user.userId });
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await Enrollment.countDocuments({
          course: course._id,
        });
        return {
          ...course.toObject(),
          enrolledCount,
        };
      })
    );

    res.json(coursesWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get students in teacher's courses
router.get("/students", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const courseIds = await Course.find({ teacher: req.user.userId }).distinct(
      "_id"
    );
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    }).populate("student");
    const students = [
      ...new Map(enrollments.map((e) => [e.student._id, e.student])).values(),
    ];

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get grades for a course
router.get("/grades/:courseId/:period", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.user.userId,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollments = await Enrollment.find({ course: course._id }).populate(
      "student"
    );
    const grades = enrollments.map((enrollment) => ({
      studentId: enrollment.student._id,
      studentName: enrollment.student.name,
      assignment: enrollment.grades?.assignment,
      quiz: enrollment.grades?.quiz,
      midterm: enrollment.grades?.midterm,
      finals: enrollment.grades?.finals,
    }));

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update grades
router.post("/grades/:courseId/:studentId", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.user.userId,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      course: course._id,
      student: req.params.studentId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.grades = {
      ...enrollment.grades,
      ...req.body,
    };
    await enrollment.save();

    res.json({ message: "Grades updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent activity
router.get("/activity", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const courseIds = await Course.find({ teacher: req.user.userId }).distinct(
      "_id"
    );
    const recentEnrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .sort({ dateEnrolled: -1 })
      .limit(5)
      .populate("student");

    const activities = recentEnrollments.map((enrollment) => ({
      description: `${enrollment.student.name} enrolled in ${enrollment.course}`,
      timestamp: enrollment.dateEnrolled,
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
