const mongoose = require("mongoose");

/**
 * Schedule Model
 * Manages class schedules for courses
 */
const scheduleSchema = new mongoose.Schema({
  // Course reference
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  
  // Teacher assigned to this schedule
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Academic term/year
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  
  // Section if applicable
  section: {
    type: String,
    default: "A"
  },
  
  // Schedule type
  scheduleType: {
    type: String,
    enum: ["lecture", "laboratory", "tutorial", "exam", "other"],
    default: "lecture",
  },
  
  // Room/Location
  room: {
    type: String,
    required: true,
  },
  
  // Day of week (0=Sunday, 1=Monday, etc.)
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: true,
  },
  
  // Start time in minutes from midnight (e.g., 9:30 AM = 9*60+30 = 570)
  startTime: {
    type: Number,
    required: true,
    min: 0,
    max: 1439 // 23:59
  },
  
  // End time in minutes from midnight
  endTime: {
    type: Number,
    required: true,
    min: 0,
    max: 1439
  },
  
  // Is this a recurring schedule?
  isRecurring: {
    type: Boolean,
    default: true
  },
  
  // For non-recurring schedules or exceptions
  specificDate: {
    type: Date
  },
  
  // Start date of this schedule (when recurring)
  startDate: {
    type: Date,
    required: function() { return this.isRecurring; }
  },
  
  // End date of this schedule (when recurring)
  endDate: {
    type: Date,
    required: function() { return this.isRecurring; }
  },
  
  // For exceptions to regular schedule (e.g., holidays, special events)
  exceptDates: [{
    type: Date
  }],
  
  // Maximum enrollment capacity
  capacity: {
    type: Number,
    min: 1,
    default: 40
  },
  
  // Additional notes about this schedule
  notes: String,
  
  // Status of the schedule
  status: {
    type: String,
    enum: ["active", "cancelled", "completed"],
    default: "active"
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Virtuals for formatted time
scheduleSchema.virtual('formattedStartTime').get(function() {
  return formatMinutesToTime(this.startTime);
});

scheduleSchema.virtual('formattedEndTime').get(function() {
  return formatMinutesToTime(this.endTime);
});

scheduleSchema.virtual('duration').get(function() {
  return this.endTime - this.startTime;
});

scheduleSchema.virtual('formattedDuration').get(function() {
  const durationMinutes = this.duration;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}h ${minutes}m`;
});

scheduleSchema.virtual('dayName').get(function() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[this.dayOfWeek];
});

// Indexes for faster querying
scheduleSchema.index({ course: 1, academicYear: 1 });
scheduleSchema.index({ teacher: 1, academicYear: 1 });
scheduleSchema.index({ dayOfWeek: 1, startTime: 1, endTime: 1 });
scheduleSchema.index({ room: 1, dayOfWeek: 1 });

// Update the updatedAt timestamp
scheduleSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Helper function to format minutes to time string (e.g., 570 -> "9:30 AM")
function formatMinutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

module.exports = mongoose.model("Schedule", scheduleSchema);
