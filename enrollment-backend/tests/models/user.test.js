/**
 * User Model Tests
 */

const chai = require('chai');
const expect = chai.expect;
const User = require('../../models/User');
const { setupTestEnv, teardownTestEnv, clearDatabase } = require('../setup');

describe('User Model', function() {
  // Setup test environment before all tests
  before(async function() {
    this.timeout(10000); // Allow time for MongoDB setup
    await setupTestEnv();
  });
  
  // Clear database before each test
  beforeEach(async function() {
    await clearDatabase();
  });
  
  // Teardown test environment after all tests
  after(async function() {
    await teardownTestEnv();
  });
  
  // Test user creation
  it('should create a new user', async function() {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
      active: true
    };
    
    const user = new User(userData);
    const savedUser = await user.save();
    
    expect(savedUser).to.have.property('_id');
    expect(savedUser.name).to.equal(userData.name);
    expect(savedUser.email).to.equal(userData.email);
    expect(savedUser.role).to.equal(userData.role);
    expect(savedUser.active).to.equal(userData.active);
    
    // Password should be hashed
    expect(savedUser.password).to.not.equal(userData.password);
  });
  
  // Test email validation
  it('should validate email format', async function() {
    const userData = {
      name: 'Invalid Email User',
      email: 'invalid-email',
      password: 'password123',
      role: 'student'
    };
    
    const user = new User(userData);
    
    try {
      await user.save();
      expect.fail('Should have failed validation');
    } catch (error) {
      expect(error.errors.email).to.exist;
    }
  });
  
  // Test role validation
  it('should validate user role', async function() {
    const userData = {
      name: 'Invalid Role User',
      email: 'test@example.com',
      password: 'password123',
      role: 'invalid-role'
    };
    
    const user = new User(userData);
    
    try {
      await user.save();
      expect.fail('Should have failed validation');
    } catch (error) {
      expect(error.errors.role).to.exist;
    }
  });
  
  // Test password hashing
  it('should hash password before saving', async function() {
    const userData = {
      name: 'Password Test User',
      email: 'password@example.com',
      password: 'password123',
      role: 'admin'
    };
    
    const user = new User(userData);
    const savedUser = await user.save();
    
    expect(savedUser.password).to.not.equal(userData.password);
    expect(savedUser.password).to.have.length.greaterThan(20); // Hashed password should be longer
  });
  
  // Test unique email constraint
  it('should not allow duplicate emails', async function() {
    const userData1 = {
      name: 'User One',
      email: 'duplicate@example.com',
      password: 'password123',
      role: 'student'
    };
    
    const userData2 = {
      name: 'User Two',
      email: 'duplicate@example.com', // Same email
      password: 'password456',
      role: 'student'
    };
    
    const user1 = new User(userData1);
    await user1.save();
    
    const user2 = new User(userData2);
    
    try {
      await user2.save();
      expect.fail('Should have failed with duplicate email');
    } catch (error) {
      expect(error.code).to.equal(11000); // MongoDB duplicate key error code
    }
  });
});
