const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  dean: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile"
  },
  chairperson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile"
  },
  programs: [{
    code: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    years: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile"
    }
  }],
  contactInfo: {
    email: String,
    phone: String,
    location: String,
    officeHours: String
  },
  establishedYear: Number,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

// Pre-defined departments for the school
departmentSchema.statics.defaultDepartments = [
  {
    code: "BSIT",
    name: "Bachelor of Science in Information Technology",
    description: "The BS Information Technology program focuses on the study of computer systems, software development, networking, and database management."
  },
  {
    code: "BSCS",
    name: "Bachelor of Science in Computer Science",
    description: "The BS Computer Science program emphasizes theoretical foundations of computing, algorithms, programming languages, and advanced computing concepts."
  },
  {
    code: "BSN",
    name: "Bachelor of Science in Nursing",
    description: "The BS Nursing program prepares students for careers in healthcare, with a focus on patient care, health promotion, and disease prevention."
  },
  {
    code: "BS RADTECH",
    name: "Bachelor of Science in Radiologic Technology",
    description: "The BS Radiologic Technology program trains students in medical imaging technology and radiologic procedures for diagnostic purposes."
  },
  {
    code: "SHS",
    name: "Senior High School",
    description: "The Senior High School program provides specialized academic, technical-vocational-livelihood, sports, and arts and design tracks for grades 11-12."
  },
  {
    code: "JHS",
    name: "Junior High School",
    description: "The Junior High School program covers the enhanced basic education curriculum for grades 7-10."
  }
];

module.exports = mongoose.model("Department", departmentSchema);
