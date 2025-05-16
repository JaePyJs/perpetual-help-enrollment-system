const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if we have any users, if not seed initial admin
    const User = require("../models/User");
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0) {
      // Use environment variables for admin credentials or fallback to defaults
      const adminName = process.env.ADMIN_NAME || "Admin User";
      const adminEmail = process.env.ADMIN_EMAIL || "admin@uphc.edu.ph";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
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
