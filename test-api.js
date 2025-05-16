const fetch = require("node-fetch");

// Test the server connection
async function testServerConnection() {
  console.log("\n=== Testing Server Connection ===");
  try {
    const response = await fetch("http://localhost:5000/test");
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, error };
  }
}

async function testLogin() {
  console.log("\n=== Testing Login ===");
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "student1",
        password: "password123",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Login response:", data);

    if (data.token) {
      console.log("Token:", data.token.substring(0, 20) + "...");
    }

    return data;
  } catch (error) {
    console.error("Error testing login:", error);
  }
}

async function testRegister() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "newstudent",
        email: "m23-1470-578@manila.uphsl.edu.ph",
        password: "password123",
        role: "student",
        name: "New Student",
      }),
    });

    const data = await response.json();
    console.log("Register response:", data);
    return data;
  } catch (error) {
    console.error("Error testing register:", error);
  }
}

async function testStudentProfile(token) {
  try {
    const response = await fetch("http://localhost:5000/api/students/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Student profile response:", data);
    return data;
  } catch (error) {
    console.error("Error testing student profile:", error);
  }
}

async function testStudentGrades(token) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/students/grades?academicYear=2023-2024&semester=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log("Student grades response:", data);
    return data;
  } catch (error) {
    console.error("Error testing student grades:", error);
  }
}

async function runTests() {
  console.log("=== Starting API Tests ===");

  // Test server connection first
  const connectionResult = await testServerConnection();
  if (!connectionResult.success) {
    console.error("Server connection failed. Aborting tests.");
    return;
  }

  // Test login
  const loginResponse = await testLogin();

  // If login successful, test other endpoints with the token
  if (loginResponse && loginResponse.token) {
    await testStudentProfile(loginResponse.token);
    await testStudentGrades(loginResponse.token);
  } else {
    // If login failed, test registration
    await testRegister();
  }

  console.log("\n=== All Tests Completed ===");
}

// Run the tests
runTests().catch((error) => {
  console.error("Test execution error:", error);
});
