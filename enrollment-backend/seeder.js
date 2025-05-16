require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");

const users = [
  {
    name: "Global Admin",
    email: "global-admin@uphc.edu.ph",
    password: "admin123",
    role: "global-admin",
  },
  {
    name: "Jam, Agoo",
    email: "admin@uphc.edu.ph",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Teacher One",
    email: "teacher@uphc.edu.ph",
    password: "teacher123",
    role: "teacher",
    employeeId: "T-2023-001",
    specialization: ["Computer Science", "Mathematics"],
  },
  {
    name: "Student One",
    email: "student@uphc.edu.ph",
    password: "student123",
    role: "student",
    department: "BSIT",
    yearLevel: 2,
    studentId: "m23-1470-578",
    section: "A",
  },
];

const courses = [
  {
    code: "MATH101",
    name: "Basic Mathematics",
    description: "Introduction to mathematical concepts",
    credits: 3,
    department: "Mathematics",
    capacity: 30,
    enrolled: 0,
  },
  {
    code: "ENG101",
    name: "English Composition",
    description: "Basic writing and communication skills",
    credits: 3,
    department: "English",
    capacity: 25,
    enrolled: 0,
  },
  {
    code: "CS101",
    name: "Introduction to Computing",
    description: "Basic concepts of computer science",
    credits: 3,
    department: "Computer Science",
    capacity: 35,
    enrolled: 0,
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      await User.deleteMany({});
      const createdUsers = await User.create(users);

      const teacher = createdUsers.find((user) => user.role === "teacher");

      await Course.deleteMany({});
      await Course.create(
        courses.map((course) => ({
          ...course,
          teacher: teacher._id,
        }))
      );

      console.log("Sample data created successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error seeding data:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
