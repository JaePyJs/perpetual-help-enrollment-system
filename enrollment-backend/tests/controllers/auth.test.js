/**
 * Authentication Controller Tests
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { setupTestEnv, teardownTestEnv, clearDatabase, seedTestData } = require('../setup');
const app = require('../../app');

chai.use(chaiHttp);

describe('Authentication Controller', function() {
  // Setup test environment before all tests
  before(async function() {
    this.timeout(10000); // Allow time for MongoDB setup
    await setupTestEnv();
  });
  
  // Seed test data before each test
  beforeEach(async function() {
    await clearDatabase();
    await seedTestData();
  });
  
  // Teardown test environment after all tests
  after(async function() {
    await teardownTestEnv();
  });
  
  // Test login endpoint
  describe('POST /api/auth/login', function() {
    it('should login with valid credentials and return token', async function() {
      const loginData = {
        email: 'admin@test.com',
        password: 'password123'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('email', loginData.email);
      expect(res.body.user).to.have.property('role', 'admin');
      expect(res.body.user).to.not.have.property('password');
    });
    
    it('should return 401 with invalid credentials', async function() {
      const loginData = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Invalid credentials');
    });
    
    it('should return 404 for non-existent user', async function() {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('User not found');
    });
  });
  
  // Test register endpoint
  describe('POST /api/auth/register', function() {
    it('should register a new user', async function() {
      const userData = {
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        role: 'teacher'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('email', userData.email);
      expect(res.body.user).to.have.property('name', userData.name);
      expect(res.body.user).to.have.property('role', userData.role);
      expect(res.body.user).to.not.have.property('password');
    });
    
    it('should return 400 for invalid data', async function() {
      const userData = {
        name: 'Invalid User',
        email: 'invalid-email', // Invalid email format
        password: 'password123',
        role: 'teacher'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Validation error');
    });
    
    it('should return 409 for duplicate email', async function() {
      const userData = {
        name: 'Duplicate User',
        email: 'admin@test.com', // Already exists
        password: 'password123',
        role: 'teacher'
      };
      
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(res).to.have.status(409);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Email already exists');
    });
  });
  
  // Test me endpoint (get current user)
  describe('GET /api/auth/me', function() {
    it('should return user data for authenticated user', async function() {
      // Login first to get token
      const loginRes = await chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });
      
      const token = loginRes.body.token;
      
      // Use token to access protected route
      const res = await chai.request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('email', 'admin@test.com');
      expect(res.body.user).to.have.property('role', 'admin');
      expect(res.body.user).to.not.have.property('password');
    });
    
    it('should return 401 for missing token', async function() {
      const res = await chai.request(app)
        .get('/api/auth/me');
      
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('No token provided');
    });
    
    it('should return 401 for invalid token', async function() {
      const res = await chai.request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Invalid token');
    });
  });
  
  // Test logout endpoint
  describe('POST /api/auth/logout', function() {
    it('should successfully logout user', async function() {
      const res = await chai.request(app)
        .post('/api/auth/logout');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Logged out successfully');
    });
  });
});
