const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'student1',
      password: 'password123',
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testRegister() {
  try {
    console.log('Testing register...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      username: 'newstudent',
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      password: 'password123',
      role: 'student',
      name: 'New Student',
    });
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testStudentProfile(token) {
  try {
    console.log('Testing student profile...');
    const response = await axios.get(`${API_URL}/students/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Student profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Student profile error:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testStudentGrades(token) {
  try {
    console.log('Testing student grades...');
    const response = await axios.get(`${API_URL}/students/grades?academicYear=2023-2024&semester=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Student grades response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Student grades error:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function runTests() {
  console.log('Running API tests...');
  
  // Test login
  const loginData = await testLogin();
  
  // If login successful, test other endpoints with the token
  if (loginData && loginData.token) {
    await testStudentProfile(loginData.token);
    await testStudentGrades(loginData.token);
  } else {
    // If login failed, test registration
    await testRegister();
  }
  
  console.log('Tests completed.');
}

runTests();
