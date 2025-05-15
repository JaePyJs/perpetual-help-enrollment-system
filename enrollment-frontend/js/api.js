/**
 * API Client Module
 * Centralized client for all API interactions with the backend
 */

const API_URL = "http://localhost:3000/api";

// CSRF token handling
const getCsrfToken = () => {
  return document.cookie.split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
};

// Common fetch options with security headers
const getRequestOptions = (method = 'GET', body = null) => {
  const token = localStorage.getItem("token");
  const csrfToken = getCsrfToken();
  
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    credentials: 'include' // Include cookies in requests
  };
  
  // Add CSRF token if available
  if (csrfToken) {
    options.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  // Add request body if provided
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  
  return options;
};

// Error handling for fetch responses
const handleResponse = async (response) => {
  // Check if the response is JSON
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Parse the response
  const data = isJson ? await response.json() : await response.text();
  
  // If the response is not ok, throw an error
  if (!response.ok) {
    // Handle unauthorized responses (token expired)
    if (response.status === 401) {
      // Clear stored token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/loginpage.html?session=expired';
    }
    
    // Throw a formatted error with status code and message
    const error = new Error(
      isJson && data.message ? data.message : 'API request failed'
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

const api = {
  /**
   * Authentication Endpoints
   */
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Include cookies for CSRF
    });
    return handleResponse(response);
  },
  
  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, getRequestOptions('POST'));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return handleResponse(response);
  },
  
  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
  
  async resetPassword(token, password, confirmPassword) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    return handleResponse(response);
  },
  
  async changePassword(currentPassword, password, confirmPassword) {
    const response = await fetch(`${API_URL}/auth/change-password`, 
      getRequestOptions('POST', { currentPassword, password, confirmPassword })
    );
    return handleResponse(response);
  },

  async getEnrollments() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async createEnrollment(enrollmentData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(enrollmentData),
    });
    return response.json();
  },

  // Teacher endpoints
  async getTeacherStats() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/teacher/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getTeacherCourses() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/teacher/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getTeacherStudents() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/teacher/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getGrades(courseId, period) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/teacher/grades/${courseId}/${period}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async updateGrades(courseId, studentId, grades) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/teacher/grades/${courseId}/${studentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(grades),
      }
    );
    return response.json();
  },

    async getTeacherActivity() {
    const response = await fetch(`${API_URL}/teacher/activity`, getRequestOptions());
    return handleResponse(response);
  },
  
  /**
   * User Management Endpoints
   */
  async getCurrentUser() {
    const response = await fetch(`${API_URL}/users/me`, getRequestOptions());
    return handleResponse(response);
  },
  
  async updateUserProfile(userData) {
    const response = await fetch(`${API_URL}/users/profile`, 
      getRequestOptions('PUT', userData)
    );
    return handleResponse(response);
  },
  
  async getUsers(queryParams = '') {
    const response = await fetch(`${API_URL}/users${queryParams}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async getUserById(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async createUser(userData) {
    const response = await fetch(`${API_URL}/users`, 
      getRequestOptions('POST', userData)
    );
    return handleResponse(response);
  },
  
  async updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/users/${userId}`, 
      getRequestOptions('PUT', userData)
    );
    return handleResponse(response);
  },
  
  async deleteUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, getRequestOptions('DELETE'));
    return handleResponse(response);
  },
  
  /**
   * Messaging Endpoints
   */
  async getMessages(queryParams = '') {
    const response = await fetch(`${API_URL}/messages${queryParams}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async getMessageById(messageId) {
    const response = await fetch(`${API_URL}/messages/${messageId}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async sendMessage(messageData) {
    const response = await fetch(`${API_URL}/messages`, 
      getRequestOptions('POST', messageData)
    );
    return handleResponse(response);
  },
  
  async replyToMessage(messageId, content, attachments = []) {
    const response = await fetch(`${API_URL}/messages/${messageId}/reply`, 
      getRequestOptions('POST', { content, attachments })
    );
    return handleResponse(response);
  },
  
  async deleteMessage(messageId) {
    const response = await fetch(`${API_URL}/messages/${messageId}`, getRequestOptions('DELETE'));
    return handleResponse(response);
  },
  
  async getMessageThread(threadId) {
    const response = await fetch(`${API_URL}/messages/thread/${threadId}`, getRequestOptions());
    return handleResponse(response);
  },
  
  /**
   * Notification Endpoints
   */
  async getNotifications(queryParams = '') {
    const response = await fetch(`${API_URL}/notifications${queryParams}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async getNotificationById(notificationId) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, getRequestOptions());
    return handleResponse(response);
  },
  
  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, 
      getRequestOptions('PUT')
    );
    return handleResponse(response);
  },
  
  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_URL}/notifications/read-all`, 
      getRequestOptions('PUT')
    );
    return handleResponse(response);
  },
  
  async deleteNotification(notificationId) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, 
      getRequestOptions('DELETE')
    );
    return handleResponse(response);
  }
};

// Expose the API globally
window.api = api;

export default api;
