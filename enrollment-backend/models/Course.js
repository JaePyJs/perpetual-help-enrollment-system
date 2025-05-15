const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  credits: {
    type: Number,
    required: true,
  },
  department: String,
  capacity: {
    type: Number,
    default: 30,
  },
  enrolled: {
    type: Number,
    default: 0,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
