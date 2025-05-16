const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('\n=== Testing Login ===');
  console.log('Request:', {
    url: `${API_URL}/auth/login`,
    method: 'POST',
    data: {
      username: 'student1',
      password: 'password123'
    }
  });
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'student1',
      password: 'password123'
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function main() {
  console.log('Starting direct API test...');
  const loginData = await testLogin();
  
  if (loginData && loginData.token) {
    console.log('\nLogin successful!');
    console.log('Token:', loginData.token.substring(0, 20) + '...');
    console.log('User:', loginData.user);
  } else {
    console.log('\nLogin failed.');
  }
}

main().catch(console.error);
