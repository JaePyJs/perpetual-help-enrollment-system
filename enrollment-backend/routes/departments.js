const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const User = require("../models/User");

// Get all departments (public, only non-sensitive fields)
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find()
      .select("name code description")
      .sort("name");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific department (public, only non-sensitive fields)
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const department = await Department.findOne({ code }).select(
      "name code description"
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    // Only return public subject and faculty info
    const departmentSubjects = await Subject.find({ department: code }).select(
      "code title units yearLevel semester"
    );
    const departmentFaculty = await User.find({
      role: "teacher",
      department: code,
    }).select("name email");
    res.json({
      department,
      subjects: departmentSubjects,
      faculty: departmentFaculty,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create department (admin only)
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { code, name, description, dean, chairperson, contactInfo } =
      req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ code });
    if (existingDepartment) {
      return res
        .status(400)
        .json({ message: "Department with this code already exists" });
    }

    const newDepartment = new Department({
      code,
      name,
      description,
      dean,
      chairperson,
      contactInfo,
      programs: [], // Initialize with empty programs array
    });

    await newDepartment.save();

    res.status(201).json({
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update department (admin only)
router.put("/:code", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { code } = req.params;
    const { name, description, dean, chairperson, contactInfo, status } =
      req.body;

    const department = await Department.findOne({ code });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update fields
    if (name) department.name = name;
    if (description) department.description = description;
    if (dean) department.dean = dean;
    if (chairperson) department.chairperson = chairperson;
    if (contactInfo) department.contactInfo = contactInfo;
    if (status) department.status = status;

    await department.save();

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add program to department (admin only)
router.post("/:code/programs", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { code } = req.params;
    const { programCode, programName, description, years, coordinator } =
      req.body;

    const department = await Department.findOne({ code });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if program already exists
    const programExists = department.programs.some(
      (p) => p.code === programCode
    );
    if (programExists) {
      return res
        .status(400)
        .json({ message: "Program with this code already exists" });
    }

    // Add new program
    department.programs.push({
      code: programCode,
      name: programName,
      description,
      years,
      coordinator,
    });

    await department.save();

    res.status(201).json({
      message: "Program added successfully",
      program: department.programs[department.programs.length - 1],
    });
  } catch (error) {
    console.error("Add program error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update program (admin only)
router.put(
  "/:code/programs/:programCode",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { code, programCode } = req.params;
      const { programName, description, years, coordinator } = req.body;

      const department = await Department.findOne({ code });
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Find program index
      const programIndex = department.programs.findIndex(
        (p) => p.code === programCode
      );
      if (programIndex === -1) {
        return res.status(404).json({ message: "Program not found" });
      }

      // Update program
      if (programName) department.programs[programIndex].name = programName;
      if (description)
        department.programs[programIndex].description = description;
      if (years) department.programs[programIndex].years = years;
      if (coordinator)
        department.programs[programIndex].coordinator = coordinator;

      await department.save();

      res.json({
        message: "Program updated successfully",
        program: department.programs[programIndex],
      });
    } catch (error) {
      console.error("Update program error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Initialize default departments
router.post("/init-defaults", auth, checkRole(["admin"]), async (req, res) => {
  try {
    // Check if departments already exist
    const existingCount = await Department.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        message: "Departments are already initialized",
        count: existingCount,
      });
    }

    // Create default departments
    const defaultDepartments = Department.defaultDepartments;

    // Insert all departments
    await Department.insertMany(defaultDepartments);

    res.status(201).json({
      message: "Default departments initialized successfully",
      departments: defaultDepartments,
    });
  } catch (error) {
    console.error("Init departments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
