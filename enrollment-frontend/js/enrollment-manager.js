/**
 * Course Enrollment Functions
 * Handles course enrollment, registration, and scheduling
 */

// Import configuration if in Node.js environment
let EnrollmentSystemConfig;
if (typeof module !== "undefined" && module.exports) {
  EnrollmentSystemConfig = require("./enrollment-config");
}

class EnrollmentManager {
  constructor(config) {
    this.config = config || EnrollmentSystemConfig;
    this.enrolledCourses = {};
    this.currentSchedule = {};
    this.waitlistedCourses = {};
    this.loadSavedData();
  }

  /**
   * Load saved enrollment data from localStorage
   */
  loadSavedData() {
    if (typeof localStorage !== "undefined") {
      try {
        const savedEnrollment = localStorage.getItem("enrolledCourses");
        if (savedEnrollment) {
          this.enrolledCourses = JSON.parse(savedEnrollment);
        }

        const savedSchedule = localStorage.getItem("currentSchedule");
        if (savedSchedule) {
          this.currentSchedule = JSON.parse(savedSchedule);
        }

        const savedWaitlist = localStorage.getItem("waitlistedCourses");
        if (savedWaitlist) {
          this.waitlistedCourses = JSON.parse(savedWaitlist);
        }
      } catch (error) {
        console.error("Error loading enrollment data:", error);
      }
    }
  }

  /**
   * Save enrollment data to localStorage
   */
  saveData() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "enrolledCourses",
        JSON.stringify(this.enrolledCourses)
      );
      localStorage.setItem(
        "currentSchedule",
        JSON.stringify(this.currentSchedule)
      );
      localStorage.setItem(
        "waitlistedCourses",
        JSON.stringify(this.waitlistedCourses)
      );
    }
  }

  /**
   * Add a course to student's enrollment
   * @param {string} studentId - Student ID
   * @param {object} course - Course object to add
   * @returns {object} - Result of the enrollment attempt
   */
  enrollInCourse(studentId, course) {
    // Validate student ID
    if (!studentId) {
      return { success: false, message: "Invalid student ID" };
    }

    // Initialize student's enrolled courses if not exists
    if (!this.enrolledCourses[studentId]) {
      this.enrolledCourses[studentId] = [];
    }

    // Check for course prerequisites
    if (
      course.prerequisites &&
      !this.hasCompletedPrerequisites(studentId, course.prerequisites)
    ) {
      return {
        success: false,
        message: `Prerequisites not met: ${course.prerequisites.join(", ")}`,
        status: "PREREQUISITES_NOT_MET",
      };
    }

    // Check for schedule conflicts
    if (this.hasScheduleConflict(studentId, course)) {
      return {
        success: false,
        message: "Schedule conflict detected",
        status: "SCHEDULE_CONFLICT",
      };
    }

    // Check for maximum units
    const currentUnits = this.calculateTotalUnits(studentId);
    if (
      currentUnits + course.units >
      this.config.enrollmentRules.maxUnitsPerSemester
    ) {
      return {
        success: false,
        message: `Exceeds maximum allowed units (${this.config.enrollmentRules.maxUnitsPerSemester})`,
        status: "MAX_UNITS_EXCEEDED",
      };
    }

    // Check if course is already enrolled
    if (this.isAlreadyEnrolled(studentId, course.code)) {
      return {
        success: false,
        message: "Already enrolled in this course",
        status: "ALREADY_ENROLLED",
      };
    }

    // Check if course is full
    if (course.currentEnrollment >= course.capacity) {
      // Add to waitlist instead
      if (!this.waitlistedCourses[studentId]) {
        this.waitlistedCourses[studentId] = [];
      }

      this.waitlistedCourses[studentId].push(course);
      this.saveData();

      return {
        success: false,
        message: "Course is full. Added to waitlist.",
        status: "WAITLISTED",
      };
    }

    // All checks passed, add course to enrollment
    this.enrolledCourses[studentId].push(course);

    // Update student's schedule
    this.updateStudentSchedule(studentId, course);

    // Save data
    this.saveData();

    return {
      success: true,
      message: "Successfully enrolled in course",
      course: course,
    };
  }

  /**
   * Check if student has already enrolled in a course
   * @param {string} studentId - Student ID
   * @param {string} courseCode - Course code to check
   * @returns {boolean} - True if already enrolled
   */
  isAlreadyEnrolled(studentId, courseCode) {
    if (!this.enrolledCourses[studentId]) return false;
    return this.enrolledCourses[studentId].some(
      (course) => course.code === courseCode
    );
  }

  /**
   * Calculate total units currently enrolled
   * @param {string} studentId - Student ID
   * @returns {number} - Total units enrolled
   */
  calculateTotalUnits(studentId) {
    if (!this.enrolledCourses[studentId]) return 0;
    return this.enrolledCourses[studentId].reduce(
      (total, course) => total + course.units,
      0
    );
  }

  /**
   * Check if course has schedule conflict with existing enrollment
   * @param {string} studentId - Student ID
   * @param {object} newCourse - Course to check
   * @returns {boolean} - True if conflict exists
   */
  hasScheduleConflict(studentId, newCourse) {
    if (!this.currentSchedule[studentId]) return false;

    // Get student's current schedule
    const schedule = this.currentSchedule[studentId];

    // Check each schedule item in the new course
    for (const newScheduleItem of newCourse.schedule) {
      const newDays = newScheduleItem.days;
      const newStart = this.parseTime(newScheduleItem.startTime);
      const newEnd = this.parseTime(newScheduleItem.endTime);

      // Check against all existing schedule items
      for (const day in schedule) {
        // Skip if this day isn't in new schedule
        if (!newDays.includes(day)) continue;

        const daySchedule = schedule[day];
        for (const slot of daySchedule) {
          const existingStart = this.parseTime(slot.startTime);
          const existingEnd = this.parseTime(slot.endTime);

          // Check for overlap
          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          ) {
            return true; // Conflict found
          }
        }
      }
    }

    return false; // No conflict
  }

  /**
   * Helper to parse time string to minutes for comparison
   * @param {string} timeString - Time in format "HH:MM AM/PM"
   * @returns {number} - Time in minutes since midnight
   */
  parseTime(timeString) {
    // Handle 24-hour format
    if (timeString.includes(":")) {
      const [hours, minutesPart] = timeString.split(":");
      let minutes = parseInt(minutesPart, 10);
      let hrs = parseInt(hours, 10);

      // Check for AM/PM
      if (minutesPart.includes("PM") && hrs < 12) {
        hrs += 12;
      } else if (minutesPart.includes("AM") && hrs === 12) {
        hrs = 0;
      }

      return hrs * 60 + minutes;
    }

    // Simple numeric format (for testing)
    return parseInt(timeString, 10);
  }

  /**
   * Update student's schedule with new course
   * @param {string} studentId - Student ID
   * @param {object} course - Course to add to schedule
   */
  updateStudentSchedule(studentId, course) {
    if (!this.currentSchedule[studentId]) {
      this.currentSchedule[studentId] = {};
    }

    const schedule = this.currentSchedule[studentId];

    // Add each schedule segment
    for (const slot of course.schedule) {
      for (const day of slot.days) {
        if (!schedule[day]) {
          schedule[day] = [];
        }

        schedule[day].push({
          courseCode: course.code,
          courseName: course.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          instructor: course.instructor,
        });

        // Sort by start time
        schedule[day].sort(
          (a, b) => this.parseTime(a.startTime) - this.parseTime(b.startTime)
        );
      }
    }
  }

  /**
   * Check if student has completed all prerequisites
   * @param {string} studentId - Student ID
   * @param {string[]} prerequisites - List of prerequisite course codes
   * @returns {boolean} - True if all prerequisites are met
   */
  hasCompletedPrerequisites(studentId, prerequisites) {
    // This would normally check academic records
    // For now, we'll assume prerequisites are met
    return true;
  }

  /**
   * Drop a course from student's enrollment
   * @param {string} studentId - Student ID
   * @param {string} courseCode - Course code to drop
   * @returns {object} - Result of the drop attempt
   */
  dropCourse(studentId, courseCode) {
    if (!this.enrolledCourses[studentId]) {
      return { success: false, message: "Student not found" };
    }

    const courseIndex = this.enrolledCourses[studentId].findIndex(
      (c) => c.code === courseCode
    );

    if (courseIndex === -1) {
      return { success: false, message: "Course not found in enrollment" };
    }

    // Get course before removing
    const course = this.enrolledCourses[studentId][courseIndex];

    // Remove from enrolled courses
    this.enrolledCourses[studentId].splice(courseIndex, 1);

    // Remove from schedule
    if (this.currentSchedule[studentId]) {
      for (const day in this.currentSchedule[studentId]) {
        this.currentSchedule[studentId][day] = this.currentSchedule[studentId][
          day
        ].filter((slot) => slot.courseCode !== courseCode);
      }
    }

    // Save data
    this.saveData();

    return {
      success: true,
      message: "Course dropped successfully",
      course: course,
    };
  }

  /**
   * Get all courses a student is enrolled in
   * @param {string} studentId - Student ID
   * @returns {array} - Array of enrolled courses
   */
  getEnrolledCourses(studentId) {
    return this.enrolledCourses[studentId] || [];
  }

  /**
   * Get student's current schedule
   * @param {string} studentId - Student ID
   * @returns {object} - Schedule object organized by day
   */
  getSchedule(studentId) {
    return this.currentSchedule[studentId] || {};
  }

  /**
   * Get courses student is waitlisted for
   * @param {string} studentId - Student ID
   * @returns {array} - Array of waitlisted courses
   */
  getWaitlistedCourses(studentId) {
    return this.waitlistedCourses[studentId] || [];
  }

  /**
   * Calculate tuition and fees based on enrolled courses
   * @param {string} studentId - Student ID
   * @returns {object} - Breakdown of fees and total
   */
  calculateTuitionAndFees(studentId) {
    const enrolledCourses = this.getEnrolledCourses(studentId);
    if (!enrolledCourses.length) {
      return {
        tuition: 0,
        fees: [],
        total: 0,
      };
    }

    // Calculate tuition based on units
    const totalUnits = this.calculateTotalUnits(studentId);
    const tuition = totalUnits * this.config.tuitionAndFees.tuitionPerUnit;

    // Calculate fees
    const fees = [];
    for (const fee of this.config.tuitionAndFees.miscFees) {
      if (fee.perTerm) {
        fees.push({
          name: fee.name,
          amount: fee.amount,
        });
      } else if (fee.perCourse && fee.appliesToCourses) {
        const applicableCourses = enrolledCourses.filter(
          (course) => course.type && fee.appliesToCourses.includes(course.type)
        );

        if (applicableCourses.length > 0) {
          fees.push({
            name: fee.name,
            amount: fee.amount * applicableCourses.length,
          });
        }
      }
    }

    // Calculate total
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const total = tuition + totalFees;

    return {
      tuition,
      fees,
      total,
    };
  }
}

// Export in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = EnrollmentManager;
}
