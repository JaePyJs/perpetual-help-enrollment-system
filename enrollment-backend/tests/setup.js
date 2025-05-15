/**
 * Test Setup Script
 * Configures the testing environment
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Global variables
let mongoServer;

/**
 * Set up testing environment before tests
 */
exports.setupTestEnv = async () => {
  console.log('Setting up test environment...');
  
  // Set environment to testing
  process.env.NODE_ENV = 'testing';
  
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Set up MongoDB connection
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log(`MongoDB Memory Server running at ${mongoUri}`);
  
  // Set up test environment variables
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.SESSION_SECRET = 'test-session-secret';
  process.env.COOKIE_SECRET = 'test-cookie-secret';
  
  // Configure test email service (use ethereal.email for testing)
  process.env.EMAIL_PROVIDER = 'test';
  
  console.log('Test environment setup complete');
};

/**
 * Clean up after tests
 */
exports.teardownTestEnv = async () => {
  console.log('Tearing down test environment...');
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  
  // Stop in-memory MongoDB server
  await mongoServer.stop();
  
  console.log('Test environment teardown complete');
};

/**
 * Clear database collections between tests
 */
exports.clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
};

/**
 * Create test seed data
 */
exports.seedTestData = async () => {
  // Import models
  const User = require('../models/User');
  const Student = require('../models/Student');
  const Department = require('../models/Department');
  
  // Create test admin user
  await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: '$2a$10$eCszFjPd.XCZ1FRaJnAjf.lBVwLf5LJ/2QOHX9LtTrj/Yd9L7fkju', // 'password123'
    role: 'admin',
    active: true
  });
  
  // Create test teacher
  await User.create({
    name: 'Test Teacher',
    email: 'teacher@test.com',
    password: '$2a$10$eCszFjPd.XCZ1FRaJnAjf.lBVwLf5LJ/2QOHX9LtTrj/Yd9L7fkju', // 'password123'
    role: 'teacher',
    active: true
  });
  
  // Create test departments
  const csDept = await Department.create({
    name: 'Computer Science',
    code: 'CS',
    description: 'Computer Science Department'
  });
  
  const busDept = await Department.create({
    name: 'Business Administration',
    code: 'BUS',
    description: 'Business Administration Department'
  });
  
  // Create test students with proper ID format
  await Student.create({
    studentId: 'm23-1470-578',
    email: 'm23-1470-578@manila.uphsl.edu.ph',
    firstName: 'John',
    lastName: 'Doe',
    department: csDept._id,
    enrollmentYear: 2023,
    program: 'Bachelor of Science in Computer Science'
  });
  
  await Student.create({
    studentId: 'm22-2213-347',
    email: 'm22-2213-347@manila.uphsl.edu.ph',
    firstName: 'Jane',
    lastName: 'Smith',
    department: busDept._id,
    enrollmentYear: 2022,
    program: 'Bachelor of Science in Business Administration'
  });
  
  console.log('Test data seeded successfully');
};

/**
 * Create an authenticated test agent
 * @param {Object} request - Supertest request object
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Authenticated agent
 */
exports.getAuthenticatedAgent = async (request, email = 'admin@test.com', password = 'password123') => {
  const agent = request.agent();
  
  // Login
  const res = await agent
    .post('/api/auth/login')
    .send({ email, password });
  
  return agent;
};
