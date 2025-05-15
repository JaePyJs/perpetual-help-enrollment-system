const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { auth, checkRole } = require("../middleware/auth");
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const Subject = require("../models/Subject");
const AcademicYear = require("../models/AcademicYear");

/**
 * @route   POST /api/schedules
 * @desc    Create a new schedule
 * @access  Private (Admin only)
 */
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const {
      course,
      teacher,
      academicYear,
      section,
      scheduleType,
      room,
      dayOfWeek,
      startTime,
      endTime,
      isRecurring,
      specificDate,
      startDate,
      endDate,
      exceptDates,
      capacity,
      notes,
      status
    } = req.body;

    // Validate that the course exists
    const courseExists = await Subject.findById(course);
    if (!courseExists) {
      return res.status(400).json({ message: "Course not found" });
    }

    // Validate that the teacher exists and is a teacher
    const teacherExists = await User.findById(teacher);
    if (!teacherExists || teacherExists.role !== "teacher") {
      return res.status(400).json({ message: "Teacher not found or user is not a teacher" });
    }

    // Validate that the academic year exists
    const academicYearExists = await AcademicYear.findById(academicYear);
    if (!academicYearExists) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    // Check for schedule conflicts with room
    const conflictingRoomSchedules = await Schedule.find({
      room,
      dayOfWeek,
      isRecurring: true,
      status: "active",
      $or: [
        // Check if new schedule starts during an existing schedule
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        // Check if new schedule ends during an existing schedule
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        // Check if new schedule entirely contains an existing schedule
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });

    if (conflictingRoomSchedules.length > 0) {
      return res.status(400).json({ 
        message: "Room scheduling conflict detected",
        conflicts: conflictingRoomSchedules
      });
    }

    // Check for schedule conflicts with teacher
    const conflictingTeacherSchedules = await Schedule.find({
      teacher,
      dayOfWeek,
      isRecurring: true,
      status: "active",
      $or: [
        // Check if new schedule starts during an existing schedule
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        // Check if new schedule ends during an existing schedule
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        // Check if new schedule entirely contains an existing schedule
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });

    if (conflictingTeacherSchedules.length > 0) {
      return res.status(400).json({ 
        message: "Teacher scheduling conflict detected",
        conflicts: conflictingTeacherSchedules
      });
    }

    // Create new schedule
    const schedule = new Schedule({
      course,
      teacher,
      academicYear,
      section,
      scheduleType,
      room,
      dayOfWeek,
      startTime,
      endTime,
      isRecurring,
      specificDate,
      startDate,
      endDate,
      exceptDates,
      capacity,
      notes,
      status: status || "active"
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules
 * @desc    Get all schedules with optional filtering
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const { 
      academicYear, 
      teacher, 
      course, 
      room, 
      dayOfWeek, 
      status 
    } = req.query;

    // Build query filters
    const filters = {};
    
    if (academicYear) filters.academicYear = academicYear;
    if (teacher) filters.teacher = teacher;
    if (course) filters.course = course;
    if (room) filters.room = room;
    if (dayOfWeek) filters.dayOfWeek = parseInt(dayOfWeek);
    if (status) filters.status = status;

    const schedules = await Schedule.find(filters)
      .populate("course", "name code")
      .populate("teacher", "name email")
      .populate("academicYear", "year term")
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules/:id
 * @desc    Get a specific schedule by ID
 * @access  Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("course", "name code")
      .populate("teacher", "name email")
      .populate("academicYear", "year term");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/schedules/:id
 * @desc    Update a schedule
 * @access  Private (Admin only)
 */
router.put("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const {
      course,
      teacher,
      academicYear,
      section,
      scheduleType,
      room,
      dayOfWeek,
      startTime,
      endTime,
      isRecurring,
      specificDate,
      startDate,
      endDate,
      exceptDates,
      capacity,
      notes,
      status
    } = req.body;

    // Find the schedule
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Check for scheduling conflicts if time/room/day is changing
    if ((room && room !== schedule.room) || 
        (dayOfWeek !== undefined && dayOfWeek !== schedule.dayOfWeek) || 
        (startTime !== undefined && startTime !== schedule.startTime) || 
        (endTime !== undefined && endTime !== schedule.endTime)) {
      
      // Check conflicts with room
      const roomToCheck = room || schedule.room;
      const dayToCheck = dayOfWeek !== undefined ? dayOfWeek : schedule.dayOfWeek;
      const startTimeToCheck = startTime !== undefined ? startTime : schedule.startTime;
      const endTimeToCheck = endTime !== undefined ? endTime : schedule.endTime;

      const conflictingRoomSchedules = await Schedule.find({
        _id: { $ne: req.params.id }, // Exclude current schedule
        room: roomToCheck,
        dayOfWeek: dayToCheck,
        isRecurring: true,
        status: "active",
        $or: [
          {
            startTime: { $lte: startTimeToCheck },
            endTime: { $gt: startTimeToCheck }
          },
          {
            startTime: { $lt: endTimeToCheck },
            endTime: { $gte: endTimeToCheck }
          },
          {
            startTime: { $gte: startTimeToCheck },
            endTime: { $lte: endTimeToCheck }
          }
        ]
      });

      if (conflictingRoomSchedules.length > 0) {
        return res.status(400).json({ 
          message: "Room scheduling conflict detected",
          conflicts: conflictingRoomSchedules
        });
      }

      // Check conflicts with teacher
      const teacherToCheck = teacher || schedule.teacher;

      const conflictingTeacherSchedules = await Schedule.find({
        _id: { $ne: req.params.id }, // Exclude current schedule
        teacher: teacherToCheck,
        dayOfWeek: dayToCheck,
        isRecurring: true,
        status: "active",
        $or: [
          {
            startTime: { $lte: startTimeToCheck },
            endTime: { $gt: startTimeToCheck }
          },
          {
            startTime: { $lt: endTimeToCheck },
            endTime: { $gte: endTimeToCheck }
          },
          {
            startTime: { $gte: startTimeToCheck },
            endTime: { $lte: endTimeToCheck }
          }
        ]
      });

      if (conflictingTeacherSchedules.length > 0) {
        return res.status(400).json({ 
          message: "Teacher scheduling conflict detected",
          conflicts: conflictingTeacherSchedules
        });
      }
    }

    // Update fields
    if (course) schedule.course = course;
    if (teacher) schedule.teacher = teacher;
    if (academicYear) schedule.academicYear = academicYear;
    if (section !== undefined) schedule.section = section;
    if (scheduleType) schedule.scheduleType = scheduleType;
    if (room) schedule.room = room;
    if (dayOfWeek !== undefined) schedule.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) schedule.startTime = startTime;
    if (endTime !== undefined) schedule.endTime = endTime;
    if (isRecurring !== undefined) schedule.isRecurring = isRecurring;
    if (specificDate) schedule.specificDate = specificDate;
    if (startDate) schedule.startDate = startDate;
    if (endDate) schedule.endDate = endDate;
    if (exceptDates) schedule.exceptDates = exceptDates;
    if (capacity) schedule.capacity = capacity;
    if (notes !== undefined) schedule.notes = notes;
    if (status) schedule.status = status;

    schedule.updatedAt = Date.now();

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Delete a schedule (or set to cancelled)
 * @access  Private (Admin only)
 */
router.delete("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { softDelete } = req.query;
    
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Soft delete (set status to cancelled) or hard delete
    if (softDelete === 'true') {
      schedule.status = 'cancelled';
      await schedule.save();
      res.json({ message: "Schedule cancelled successfully" });
    } else {
      await Schedule.deleteOne({ _id: req.params.id });
      res.json({ message: "Schedule deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules/teacher/:teacherId
 * @desc    Get schedules for a specific teacher
 * @access  Private
 */
router.get("/teacher/:teacherId", auth, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { academicYear } = req.query;

    // Check authorization - only the teacher or admins can view
    if (
      req.user.id !== teacherId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this teacher's schedule" });
    }

    let query = { teacher: teacherId };
    
    // Add optional filters
    if (academicYear) {
      query.academicYear = academicYear;
    }

    // Only get active schedules by default
    if (!req.query.includeInactive) {
      query.status = "active";
    }

    const schedules = await Schedule.find(query)
      .populate("course", "name code")
      .populate("academicYear", "year term")
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching teacher schedules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules/student/:studentId
 * @desc    Get schedules for a specific student based on enrolled courses
 * @access  Private
 */
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear } = req.query;

    // Find the student by studentId
    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check authorization - only the student or teachers/admins can view
    if (
      req.user.id !== student._id.toString() &&
      !["teacher", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized to view this student's schedule" });
    }

    // Get student's enrolled courses
    // This would typically come from an Enrollment model
    // For this example, let's assume we have a route to get enrollments
    const enrollmentsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/enrollment/student/${student._id}?academicYear=${academicYear || ''}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    
    if (!enrollmentsResponse.ok) {
      return res.status(500).json({ message: "Failed to fetch student enrollments" });
    }
    
    const enrollments = await enrollmentsResponse.json();
    
    // Extract course IDs from enrollments
    const courseIds = enrollments.map(enrollment => enrollment.course);
    
    if (courseIds.length === 0) {
      return res.json([]);
    }

    // Find schedules for these courses
    let query = { 
      course: { $in: courseIds },
      status: "active"
    };
    
    if (academicYear) {
      query.academicYear = academicYear;
    }

    const schedules = await Schedule.find(query)
      .populate("course", "name code")
      .populate("teacher", "name")
      .populate("academicYear", "year term")
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching student schedules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules/room/:roomId
 * @desc    Get schedules for a specific room
 * @access  Private
 */
router.get("/room/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date, academicYear } = req.query;

    let query = { room: roomId };
    
    // Add filters
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    // Only get active schedules by default
    if (!req.query.includeInactive) {
      query.status = "active";
    }

    // If specific date is provided, filter by day of week
    if (date) {
      const specificDate = new Date(date);
      const dayOfWeek = specificDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      query.dayOfWeek = dayOfWeek;
    }

    const schedules = await Schedule.find(query)
      .populate("course", "name code")
      .populate("teacher", "name")
      .populate("academicYear", "year term")
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching room schedules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/schedules/conflicts/check
 * @desc    Check for scheduling conflicts
 * @access  Private (Admin only)
 */
router.get("/conflicts/check", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { 
      room, 
      teacher, 
      dayOfWeek, 
      startTime, 
      endTime,
      scheduleId // Exclude this schedule from conflict check if updating
    } = req.query;

    if (!room && !teacher) {
      return res.status(400).json({ message: "Must provide room or teacher to check conflicts" });
    }

    if (!dayOfWeek || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: "Must provide dayOfWeek, startTime, and endTime" });
    }

    // Build query
    const baseQuery = {
      dayOfWeek: parseInt(dayOfWeek),
      status: "active",
      $or: [
        // Check if new schedule starts during an existing schedule
        {
          startTime: { $lte: parseInt(startTime) },
          endTime: { $gt: parseInt(startTime) }
        },
        // Check if new schedule ends during an existing schedule
        {
          startTime: { $lt: parseInt(endTime) },
          endTime: { $gte: parseInt(endTime) }
        },
        // Check if new schedule entirely contains an existing schedule
        {
          startTime: { $gte: parseInt(startTime) },
          endTime: { $lte: parseInt(endTime) }
        }
      ]
    };

    // Exclude current schedule if updating
    if (scheduleId) {
      baseQuery._id = { $ne: scheduleId };
    }

    // Check room conflicts
    let roomConflicts = [];
    if (room) {
      roomConflicts = await Schedule.find({
        ...baseQuery,
        room
      }).populate("course", "name code").populate("teacher", "name");
    }

    // Check teacher conflicts
    let teacherConflicts = [];
    if (teacher) {
      teacherConflicts = await Schedule.find({
        ...baseQuery,
        teacher
      }).populate("course", "name code").populate("room");
    }

    res.json({
      hasConflicts: roomConflicts.length > 0 || teacherConflicts.length > 0,
      roomConflicts,
      teacherConflicts
    });
  } catch (error) {
    console.error("Error checking schedule conflicts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
