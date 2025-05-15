const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const Subject = require("../models/Subject");
const User = require("../models/User");

// Get all subjects (with filtering options)
router.get("/", async (req, res) => {
  try {
    const { department, yearLevel, semester, search } = req.query;
    
    // Build query
    let query = {};
    
    // Add department filter if provided
    if (department) {
      query.department = department;
    }
    
    // Add year level filter if provided
    if (yearLevel) {
      query.yearLevel = parseInt(yearLevel);
    }
    
    // Add semester filter if provided
    if (semester) {
      query.semester = semester;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    // Get subjects with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const subjects = await Subject.find(query)
      .populate('prerequisites', 'code title units')
      .populate('corequisites', 'code title units')
      .skip(skip)
      .limit(limit)
      .sort({ department: 1, yearLevel: 1, semester: 1, code: 1 });
      
    // Get total count for pagination
    const total = await Subject.countDocuments(query);
    
    res.json({
      subjects,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific subject
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id)
      .populate('prerequisites', 'code title units')
      .populate('corequisites', 'code title units');
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    res.json(subject);
  } catch (error) {
    console.error("Get subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create subject (admin only)
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { 
      code, 
      title, 
      description, 
      units, 
      department, 
      yearLevel, 
      semester,
      prerequisites,
      corequisites,
      isCore,
      isElective,
      maxStudents,
      syllabus
    } = req.body;
    
    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject with this code already exists" });
    }
    
    const newSubject = new Subject({
      code,
      title,
      description,
      units: {
        lecture: units.lecture || 0,
        laboratory: units.laboratory || 0,
        total: (units.lecture || 0) + (units.laboratory || 0)
      },
      department,
      yearLevel,
      semester,
      prerequisites: prerequisites || [],
      corequisites: corequisites || [],
      isCore: isCore !== undefined ? isCore : true,
      isElective: isElective !== undefined ? isElective : false,
      maxStudents: maxStudents || 40,
      syllabus
    });
    
    await newSubject.save();
    
    res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject
    });
  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update subject (admin only)
router.put("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      units, 
      department, 
      yearLevel, 
      semester,
      prerequisites,
      corequisites,
      isCore,
      isElective,
      maxStudents,
      syllabus,
      status
    } = req.body;
    
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    // Update fields
    if (title) subject.title = title;
    if (description) subject.description = description;
    if (units) {
      subject.units.lecture = units.lecture || subject.units.lecture;
      subject.units.laboratory = units.laboratory || subject.units.laboratory;
      subject.units.total = (units.lecture || subject.units.lecture) + (units.laboratory || subject.units.laboratory);
    }
    if (department) subject.department = department;
    if (yearLevel) subject.yearLevel = yearLevel;
    if (semester) subject.semester = semester;
    if (prerequisites) subject.prerequisites = prerequisites;
    if (corequisites) subject.corequisites = corequisites;
    if (isCore !== undefined) subject.isCore = isCore;
    if (isElective !== undefined) subject.isElective = isElective;
    if (maxStudents) subject.maxStudents = maxStudents;
    if (syllabus) subject.syllabus = syllabus;
    if (status) subject.status = status;
    
    await subject.save();
    
    res.json({
      message: "Subject updated successfully",
      subject
    });
  } catch (error) {
    console.error("Update subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete subject (admin only)
router.delete("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    // Instead of deleting, mark as inactive
    subject.status = "inactive";
    await subject.save();
    
    res.json({ 
      message: "Subject marked as inactive" 
    });
  } catch (error) {
    console.error("Delete subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get subjects by department curriculum
router.get("/curriculum/:department", async (req, res) => {
  try {
    const { department } = req.params;
    const { yearLevel } = req.query;
    
    let query = { department };
    
    if (yearLevel) {
      query.yearLevel = parseInt(yearLevel);
    }
    
    // Group subjects by year level and semester
    const subjects = await Subject.find(query)
      .sort({ yearLevel: 1, semester: 1, code: 1 })
      .populate('prerequisites', 'code title');
    
    // Organize into curriculum structure
    const curriculum = {};
    
    subjects.forEach(subject => {
      const year = subject.yearLevel.toString();
      const sem = subject.semester;
      
      if (!curriculum[year]) {
        curriculum[year] = {};
      }
      
      if (!curriculum[year][sem]) {
        curriculum[year][sem] = [];
      }
      
      curriculum[year][sem].push(subject);
    });
    
    res.json({
      department,
      curriculum
    });
  } catch (error) {
    console.error("Get curriculum error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate subjects for a curriculum (admin only)
router.post("/generate-curriculum", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { department, program } = req.body;
    
    // Sample curriculum for BSIT (simplified example)
    // In a real application, this would be more complete and read from a template
    
    // Check if subjects already exist for this department
    const existingSubjects = await Subject.countDocuments({ department });
    if (existingSubjects > 0) {
      return res.status(400).json({ 
        message: "Subjects already exist for this department",
        count: existingSubjects 
      });
    }
    
    // Example subjects for first year, first semester BSIT
    const subjects = [];
    
    if (department === "BSIT") {
      // First Year, First Semester
      subjects.push({
        code: "GE101",
        title: "Understanding the Self",
        description: "A study of the self, its development, and its relationship with others.",
        units: {
          lecture: 3,
          laboratory: 0,
          total: 3
        },
        department: "BSIT",
        yearLevel: 1,
        semester: "1st",
        isCore: true
      });
      
      subjects.push({
        code: "GE102",
        title: "Mathematics in the Modern World",
        description: "Application of mathematics in real-world scenarios.",
        units: {
          lecture: 3,
          laboratory: 0,
          total: 3
        },
        department: "BSIT",
        yearLevel: 1,
        semester: "1st",
        isCore: true
      });
      
      subjects.push({
        code: "IT101",
        title: "Introduction to Computing",
        description: "Basic concepts of computing and information technology.",
        units: {
          lecture: 2,
          laboratory: 1,
          total: 3
        },
        department: "BSIT",
        yearLevel: 1,
        semester: "1st",
        isCore: true
      });
      
      // First Year, Second Semester
      subjects.push({
        code: "GE103",
        title: "Purposive Communication",
        description: "Development of communication skills for academic and professional purposes.",
        units: {
          lecture: 3,
          laboratory: 0,
          total: 3
        },
        department: "BSIT",
        yearLevel: 1,
        semester: "2nd",
        isCore: true
      });
      
      subjects.push({
        code: "IT102",
        title: "Computer Programming 1",
        description: "Introduction to programming concepts and problem-solving.",
        units: {
          lecture: 2,
          laboratory: 1,
          total: 3
        },
        department: "BSIT",
        yearLevel: 1,
        semester: "2nd",
        isCore: true,
        prerequisites: [] // Will be updated with IDs after creation
      });
      
      // Second Year, First Semester
      subjects.push({
        code: "IT201",
        title: "Data Structures and Algorithms",
        description: "Study of data structures and algorithms for efficient program design.",
        units: {
          lecture: 2,
          laboratory: 1,
          total: 3
        },
        department: "BSIT",
        yearLevel: 2,
        semester: "1st",
        isCore: true,
        prerequisites: [] // Will be updated with IT102 ID after creation
      });
    } else if (department === "BSCS") {
      // Sample CS curriculum
      subjects.push({
        code: "CS101",
        title: "Introduction to Computer Science",
        description: "Basic concepts of computer science and computational thinking.",
        units: {
          lecture: 3,
          laboratory: 0,
          total: 3
        },
        department: "BSCS",
        yearLevel: 1,
        semester: "1st",
        isCore: true
      });
      
      // Add more CS subjects...
    }
    
    // Create all subjects
    const createdSubjects = await Subject.insertMany(subjects);
    
    // Update prerequisites (for example, linking IT201 to IT102)
    if (department === "BSIT") {
      const it102 = createdSubjects.find(s => s.code === "IT102");
      const it201 = createdSubjects.find(s => s.code === "IT201");
      
      if (it102 && it201) {
        it201.prerequisites = [it102._id];
        await it201.save();
      }
    }
    
    res.status(201).json({
      message: "Curriculum subjects generated successfully",
      count: createdSubjects.length,
      subjects: createdSubjects
    });
  } catch (error) {
    console.error("Generate curriculum error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
