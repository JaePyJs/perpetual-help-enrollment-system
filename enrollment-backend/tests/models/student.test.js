/**
 * Student Model Tests
 */

const chai = require('chai');
const expect = chai.expect;
const Student = require('../../models/Student');
const Department = require('../../models/Department');
const { setupTestEnv, teardownTestEnv, clearDatabase } = require('../setup');

describe('Student Model', function() {
  let department;
  
  // Setup test environment before all tests
  before(async function() {
    this.timeout(10000); // Allow time for MongoDB setup
    await setupTestEnv();
  });
  
  // Clear database and create test department before each test
  beforeEach(async function() {
    await clearDatabase();
    
    // Create test department
    department = await Department.create({
      name: 'Computer Science',
      code: 'CS',
      description: 'Computer Science Department'
    });
  });
  
  // Teardown test environment after all tests
  after(async function() {
    await teardownTestEnv();
  });
  
  // Test student creation
  it('should create a new student with valid data', async function() {
    const studentData = {
      studentId: 'm23-1470-578',
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      firstName: 'John',
      lastName: 'Doe',
      department: department._id,
      enrollmentYear: 2023,
      program: 'Bachelor of Science in Computer Science'
    };
    
    const student = new Student(studentData);
    const savedStudent = await student.save();
    
    expect(savedStudent).to.have.property('_id');
    expect(savedStudent.studentId).to.equal(studentData.studentId);
    expect(savedStudent.email).to.equal(studentData.email);
    expect(savedStudent.firstName).to.equal(studentData.firstName);
    expect(savedStudent.lastName).to.equal(studentData.lastName);
    expect(savedStudent.department.toString()).to.equal(department._id.toString());
    expect(savedStudent.enrollmentYear).to.equal(studentData.enrollmentYear);
    expect(savedStudent.program).to.equal(studentData.program);
  });
  
  // Test student ID format validation (m[YY]-XXXX-XXX)
  it('should validate student ID format', async function() {
    const invalidIdFormats = [
      'x23-1470-578', // Wrong prefix
      'm234-1470-578', // Year too long
      'm2-1470-578',  // Year too short
      'm23-170-578',  // First segment too short
      'm23-14701-578', // First segment too long
      'm23-1470-58',  // Second segment too short
      'm23-1470-5789', // Second segment too long
      'm23_1470_578',  // Wrong separator
      '231470578'      // No separators
    ];
    
    for (const invalidId of invalidIdFormats) {
      const studentData = {
        studentId: invalidId,
        email: `${invalidId}@manila.uphsl.edu.ph`,
        firstName: 'Invalid',
        lastName: 'Student',
        department: department._id,
        enrollmentYear: 2023,
        program: 'Bachelor of Science in Computer Science'
      };
      
      const student = new Student(studentData);
      
      try {
        await student.save();
        expect.fail(`Should have failed validation for ID: ${invalidId}`);
      } catch (error) {
        expect(error.errors.studentId).to.exist;
      }
    }
  });
  
  // Test email format validation
  it('should validate student email format based on student ID', async function() {
    const studentId = 'm23-1470-578';
    
    // Valid email based on ID format
    const validEmail = `${studentId}@manila.uphsl.edu.ph`;
    
    // Invalid emails
    const invalidEmails = [
      'm23-1470-578@gmail.com',                // Wrong domain
      'm23-1470-579@manila.uphsl.edu.ph',      // ID in email doesn't match studentId
      'm23-1470-578@manila.uphsl.edu',         // Incomplete domain
      'm231470578@manila.uphsl.edu.ph'         // Missing dashes in ID part
    ];
    
    // Test valid email
    const validStudentData = {
      studentId: studentId,
      email: validEmail,
      firstName: 'Valid',
      lastName: 'Student',
      department: department._id,
      enrollmentYear: 2023,
      program: 'Bachelor of Science in Computer Science'
    };
    
    const validStudent = new Student(validStudentData);
    await validStudent.save();
    
    // Test invalid emails
    for (const invalidEmail of invalidEmails) {
      const studentData = {
        studentId: studentId,
        email: invalidEmail,
        firstName: 'Invalid',
        lastName: 'Email',
        department: department._id,
        enrollmentYear: 2023,
        program: 'Bachelor of Science in Computer Science'
      };
      
      const student = new Student(studentData);
      
      try {
        await student.save();
        expect.fail(`Should have failed validation for email: ${invalidEmail}`);
      } catch (error) {
        expect(error.errors.email).to.exist;
      }
    }
  });
  
  // Test unique student ID constraint
  it('should not allow duplicate student IDs', async function() {
    const studentData1 = {
      studentId: 'm23-1470-578',
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      firstName: 'John',
      lastName: 'Doe',
      department: department._id,
      enrollmentYear: 2023,
      program: 'Bachelor of Science in Computer Science'
    };
    
    const studentData2 = {
      studentId: 'm23-1470-578', // Same ID
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      firstName: 'Jane',
      lastName: 'Smith',
      department: department._id,
      enrollmentYear: 2023,
      program: 'Bachelor of Science in Computer Science'
    };
    
    const student1 = new Student(studentData1);
    await student1.save();
    
    const student2 = new Student(studentData2);
    
    try {
      await student2.save();
      expect.fail('Should have failed with duplicate student ID');
    } catch (error) {
      expect(error.code).to.equal(11000); // MongoDB duplicate key error code
    }
  });
  
  // Test enrollment year matches year in student ID
  it('should validate that enrollment year matches the year in student ID', async function() {
    // Student with mismatched year (ID says 23 but enrollment year is 2022)
    const studentData = {
      studentId: 'm23-1470-578',
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      firstName: 'Mismatch',
      lastName: 'Year',
      department: department._id,
      enrollmentYear: 2022, // Should be 2023 to match ID
      program: 'Bachelor of Science in Computer Science'
    };
    
    const student = new Student(studentData);
    
    try {
      await student.save();
      expect.fail('Should have failed validation for mismatched enrollment year');
    } catch (error) {
      expect(error.errors.enrollmentYear).to.exist;
    }
  });
});
