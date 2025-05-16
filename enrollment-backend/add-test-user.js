require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

console.log("Starting script...");
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Defined" : "Undefined");

async function addTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Check if test user already exists
    const existingUser = await User.findOne({ studentId: "student1" });
    if (existingUser) {
      console.log("Test user already exists");
      console.log("User details:", {
        name: existingUser.name,
        email: existingUser.email,
        studentId: existingUser.studentId,
        role: existingUser.role,
      });

      // Update password to ensure it's correct
      existingUser.password = await bcrypt.hash("password123", 10);
      await existingUser.save();
      console.log("Password updated");
    } else {
      // Create a test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const testUser = new User({
        name: "Test Student",
        email: "student1@test.com",
        password: hashedPassword,
        studentId: "student1",
        role: "student",
        department: "BSIT",
        yearLevel: 1,
        section: "A",
        status: "active",
        profileImage: "default-profile.png",
        passwordResetRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await testUser.save();
      console.log("Test user created successfully");
    }

    // List all users
    const users = await User.find().select("-password");
    console.log("All users:");
    users.forEach((user) => {
      console.log(
        `- ${user.name} (${user.email}), Role: ${user.role}, ID: ${
          user.studentId || user._id
        }`
      );
    });

    mongoose.disconnect();
    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
    mongoose.disconnect();
  }
}

addTestUser();
