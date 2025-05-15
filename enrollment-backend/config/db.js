const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if we have any users, if not seed initial admin
    const User = require("../models/User");
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0) {
      await User.create({
        name: "Admin User",
        email: "admin@school.edu",
        password: "admin123",
        role: "admin",
      });
      console.log("Admin user seeded");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
