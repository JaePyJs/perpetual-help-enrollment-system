/**
 * Student Controller Tests
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { setupTestEnv, teardownTestEnv, clearDatabase, seedTestData } = require('../setup');
const app = require('../../app');

chai.use(chaiHttp);

describe('Student Controller', function() {
  let authToken;
  
  // Setup test environment before all tests
  before(async function() {
    this.timeout(10000); // Allow time for MongoDB setup
    await setupTestEnv();
  });
  
  // Seed test data and get authentication token before each test
  beforeEach(async function() {
    await clearDatabase();
    await seedTestData();
    
    // Get auth token for admin user
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    authToken = loginRes.body.token;
  });
  
  // Teardown test environment after all tests
  after(async function() {
    await teardownTestEnv();
  });
  
  // Test get all students endpoint
  describe('GET /api/students', function() {
    it('should return all students for authenticated admin', async function() {
      const res = await chai.request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('students');
      expect(res.body.students).to.be.an('array');
      expect(res.body.students).to.have.lengthOf(2); // We seeded 2 students
      
      // Verify student ID format
      const student = res.body.students[0];
      expect(student).to.have.property('studentId');
      expect(student.studentId).to.match(/^m\d{2}-\d{4}-\d{3}$/); // Format m[YY]-XXXX-XXX
    });
    
    it('should return 401 for unauthenticated request', async function() {
      const res = await chai.request(app)
        .get('/api/students');
      
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
  });
  
  // Test get student by ID endpoint
  describe('GET /api/students/:id', function() {
    it('should return a specific student by ID', async function() {
      // First get all students to extract a valid ID
      const studentsRes = await chai.request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      const studentId = studentsRes.body.students[0]._id;
      
      // Get specific student
      const res = await chai.request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('student');
      expect(res.body.student).to.have.property('_id', studentId);
      expect(res.body.student.studentId).to.match(/^m\d{2}-\d{4}-\d{3}$/); // Format m[YY]-XXXX-XXX
      
      // Email should follow format [student-id]@manila.uphsl.edu.ph
      expect(res.body.student.email).to.equal(`${res.body.student.studentId}@manila.uphsl.edu.ph`);
    });
    
    it('should return 404 for non-existent student ID', async function() {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId but doesn't exist
      
      const res = await chai.request(app)
        .get(`/api/students/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });
  
  // Test create student endpoint
  describe('POST /api/students', function() {
    it('should create a new student with valid data', async function() {
      // First get all departments to extract a valid department ID
      const departmentsRes = await chai.request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${authToken}`);
      
      const departmentId = departmentsRes.body.departments[0]._id;
      
      const studentData = {
        studentId: 'm24-1580-678', // Following format m[YY]-XXXX-XXX
        email: 'm24-1580-678@manila.uphsl.edu.ph', // Matches student ID
        firstName: 'New',
        lastName: 'Student',
        department: departmentId,
        enrollmentYear: 2024, // Matches year in student ID
        program: 'Bachelor of Science in Information Technology'
      };
      
      const res = await chai.request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);
      
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('student');
      expect(res.body.student).to.have.property('studentId', studentData.studentId);
      expect(res.body.student).to.have.property('email', studentData.email);
      expect(res.body.student).to.have.property('firstName', studentData.firstName);
      expect(res.body.student).to.have.property('lastName', studentData.lastName);
      expect(res.body.student).to.have.property('enrollmentYear', studentData.enrollmentYear);
      expect(res.body.student).to.have.property('program', studentData.program);
    });
    
    it('should reject student with invalid ID format', async function() {
      // First get all departments to extract a valid department ID
      const departmentsRes = await chai.request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${authToken}`);
      
      const departmentId = departmentsRes.body.departments[0]._id;
      
      const studentData = {
        studentId: '123-456-789', // Invalid format (should be m[YY]-XXXX-XXX)
        email: '123-456-789@manila.uphsl.edu.ph',
        firstName: 'Invalid',
        lastName: 'Format',
        department: departmentId,
        enrollmentYear: 2024,
        program: 'Bachelor of Science in Information Technology'
      };
      
      const res = await chai.request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Validation error');
    });
    
    it('should reject student with mismatched email', async function() {
      // First get all departments to extract a valid department ID
      const departmentsRes = await chai.request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${authToken}`);
      
      const departmentId = departmentsRes.body.departments[0]._id;
      
      const studentData = {
        studentId: 'm24-1580-678',
        email: 'm24-1580-679@manila.uphsl.edu.ph', // Email doesn't match student ID
        firstName: 'Mismatch',
        lastName: 'Email',
        department: departmentId,
        enrollmentYear: 2024,
        program: 'Bachelor of Science in Information Technology'
      };
      
      const res = await chai.request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Email must match studentId');
    });
    
    it('should reject student when enrollment year doesn\'t match ID', async function() {
      // First get all departments to extract a valid department ID
      const departmentsRes = await chai.request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${authToken}`);
      
      const departmentId = departmentsRes.body.departments[0]._id;
      
      const studentData = {
        studentId: 'm24-1580-678',
        email: 'm24-1580-678@manila.uphsl.edu.ph',
        firstName: 'Mismatch',
        lastName: 'Year',
        department: departmentId,
        enrollmentYear: 2023, // Doesn't match '24' in student ID
        program: 'Bachelor of Science in Information Technology'
      };
      
      const res = await chai.request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Enrollment year must match year in student ID');
    });
  });
  
  // Test update student endpoint
  describe('PUT /api/students/:id', function() {
    it('should update a student with valid data', async function() {
      // First get all students to extract a valid ID
      const studentsRes = await chai.request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      const studentId = studentsRes.body.students[0]._id;
      const originalStudentId = studentsRes.body.students[0].studentId;
      
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        program: 'Updated Program'
      };
      
      const res = await chai.request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('student');
      expect(res.body.student).to.have.property('_id', studentId);
      expect(res.body.student).to.have.property('studentId', originalStudentId); // ID shouldn't change
      expect(res.body.student).to.have.property('firstName', updateData.firstName);
      expect(res.body.student).to.have.property('lastName', updateData.lastName);
      expect(res.body.student).to.have.property('program', updateData.program);
    });
    
    it('should not allow changing student ID or email', async function() {
      // First get all students to extract a valid ID
      const studentsRes = await chai.request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      const studentId = studentsRes.body.students[0]._id;
      
      const updateData = {
        studentId: 'm25-9999-999', // Try to change ID
        email: 'm25-9999-999@manila.uphsl.edu.ph' // Try to change email
      };
      
      const res = await chai.request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Cannot change studentId or email');
    });
  });
  
  // Test delete student endpoint
  describe('DELETE /api/students/:id', function() {
    it('should delete a student', async function() {
      // First get all students to extract a valid ID
      const studentsRes = await chai.request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      const studentId = studentsRes.body.students[0]._id;
      
      const res = await chai.request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Student deleted successfully');
      
      // Verify student is actually deleted
      const checkRes = await chai.request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(checkRes).to.have.status(404);
    });
    
    it('should return 404 for non-existent student ID', async function() {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId but doesn't exist
      
      const res = await chai.request(app)
        .delete(`/api/students/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });
});
