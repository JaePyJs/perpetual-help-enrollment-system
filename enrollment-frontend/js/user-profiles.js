/**
 * User Profile Management Module
 * Handles user profile browsing, viewing, and editing functionality
 */

// Sample data for demo purposes - in a real application, this would come from the backend API
const sampleUsers = [
  {
    id: '1',
    userId: 'm23-1470-578',
    firstName: 'John',
    middleName: 'David',
    lastName: 'Smith',
    email: 'm23-1470-578@manila.uphsl.edu.ph',
    phone: '09123456789',
    dateOfBirth: '2000-05-15',
    gender: 'male',
    nationality: 'Filipino',
    address: '123 Main Street, Manila',
    role: 'student',
    avatarUrl: '',
    program: 'BS Computer Science',
    yearLevel: '2',
    section: 'A',
    guardianName: 'Mary Smith',
    guardianContact: '09876543210'
  },
  {
    id: '2',
    userId: 't2023-5678',
    firstName: 'Maria',
    middleName: 'Elena',
    lastName: 'Reyes',
    email: 'maria.reyes@faculty.uphsl.edu.ph',
    phone: '09234567890',
    dateOfBirth: '1985-10-20',
    gender: 'female',
    nationality: 'Filipino',
    address: '456 Oak Avenue, Quezon City',
    role: 'teacher',
    avatarUrl: '',
    department: 'Computer Studies',
    position: 'Assistant Professor',
    employmentType: 'full-time',
    specialization: 'Data Science, Machine Learning'
  },
  {
    id: '3',
    userId: 'a2023-1234',
    firstName: 'Robert',
    middleName: 'James',
    lastName: 'Garcia',
    email: 'robert.garcia@admin.uphsl.edu.ph',
    phone: '09345678901',
    dateOfBirth: '1978-03-25',
    gender: 'male',
    nationality: 'Filipino',
    address: '789 Pine Street, Mandaluyong',
    role: 'admin',
    avatarUrl: '',
    adminRole: 'system-admin',
    accessLevel: '4',
    departmentAssignment: 'IT Department'
  },
  {
    id: '4',
    userId: 'm22-2580-364',
    firstName: 'Sarah',
    middleName: 'Joy',
    lastName: 'Santos',
    email: 'm22-2580-364@manila.uphsl.edu.ph',
    phone: '09456789012',
    dateOfBirth: '2001-12-05',
    gender: 'female',
    nationality: 'Filipino',
    address: '321 Maple Road, Pasig City',
    role: 'student',
    avatarUrl: '',
    program: 'BS Information Technology',
    yearLevel: '3',
    section: 'B',
    guardianName: 'Pedro Santos',
    guardianContact: '09765432109'
  }
];

// Sample program and department data
const samplePrograms = [
  'BS Computer Science',
  'BS Information Technology',
  'BS Information Systems',
  'BS Applied Mathematics',
  'BS Psychology',
  'BS Business Administration',
  'BS Accountancy',
  'BS Civil Engineering',
  'BS Mechanical Engineering',
  'BS Electrical Engineering',
  'BS Architecture',
  'BS Nursing',
  'BS Biology',
  'BS Chemistry',
  'BS Physics',
  'BA Communication',
  'BA English',
  'BA Political Science',
  'BA History',
  'BA Economics'
];

const sampleDepartments = [
  'Computer Studies',
  'Mathematics',
  'Science',
  'Engineering',
  'Business and Accountancy',
  'Arts and Humanities',
  'Social Sciences',
  'Health Sciences',
  'IT Department',
  'Admissions Office',
  'Registrar Office',
  'Finance Office',
  'Academic Affairs',
  'Student Affairs'
];

// Initialize the user profile management module
document.addEventListener('DOMContentLoaded', function() {
  // Initialize security modules if available
  if (window.SecurityModule) {
    SecurityModule.init();
  }
  
  if (window.SessionManager) {
    SessionManager.init();
    
    // Check if user is logged in
    const currentUser = SessionManager.getCurrentUser();
    if (!currentUser) {
      // Redirect to login page with appropriate message
      SessionManager.redirectToLogin('You must be logged in to access user profiles.');
      return;
    }
    
    // Check if user has permission to access this page
    if (!hasProfileAccess(currentUser)) {
      window.location.href = 'access-denied.html';
      return;
    }
  }
  
  // Initialize program and department dropdowns
  initializeDropdowns();
  
  // Load users
  loadUsers();
  
  // Set up form validation and submission
  setupFormHandling();
  
  // Set up search functionality
  setupSearch();
  
  // Log page access
  logAccessEvent('user_profiles_page_access');
});

/**
 * Check if the current user has access to view/edit profiles
 * @param {Object} user - The current user object
 * @returns {boolean} Whether the user has access
 */
function hasProfileAccess(user) {
  // In a real implementation, this would check user roles and permissions
  // For demo purposes, we'll allow access to all authenticated users
  return true;
}

/**
 * Initialize program and department dropdowns
 */
function initializeDropdowns() {
  // Program dropdown
  const programDropdown = document.getElementById('program');
  if (programDropdown) {
    samplePrograms.forEach(program => {
      const option = document.createElement('option');
      option.value = program;
      option.textContent = program;
      programDropdown.appendChild(option);
    });
  }
  
  // Department dropdowns
  const departmentDropdowns = [
    document.getElementById('department'),
    document.getElementById('department-assignment')
  ];
  
  departmentDropdowns.forEach(dropdown => {
    if (dropdown) {
      sampleDepartments.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        dropdown.appendChild(option);
      });
    }
  });
}

/**
 * Load users into the user list
 * @param {Array} users - Optional array of users to display (filtered)
 */
function loadUsers(users = null) {
  const userList = document.getElementById('user-list');
  if (!userList) return;
  
  // Clear current list
  userList.innerHTML = '';
  
  // Use provided users or default to all sample users
  const usersToDisplay = users || sampleUsers;
  
  if (usersToDisplay.length === 0) {
    userList.innerHTML = '<p class="no-results">No users found matching your search criteria.</p>';
    return;
  }
  
  // Create user cards
  usersToDisplay.forEach(user => {
    const userCard = createUserCard(user);
    userList.appendChild(userCard);
  });
}

/**
 * Create a user card element
 * @param {Object} user - The user data object
 * @returns {HTMLElement} The user card element
 */
function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.dataset.userId = user.id;
  card.onclick = () => selectUser(user);
  
  // Get initial for avatar
  const initial = user.firstName.charAt(0).toUpperCase();
  
  // Role display names and classes
  const roleDisplayNames = {
    'student': 'Student',
    'teacher': 'Teacher',
    'admin': 'Admin'
  };
  
  // Create card content
  card.innerHTML = `
    <div class="user-card-header">
      <div class="user-card-avatar">
        ${user.avatarUrl ? `<img src="${user.avatarUrl}" alt="${user.firstName} ${user.lastName}">` : initial}
      </div>
      <div>
        <h3>${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '. ' : ''}${user.lastName}</h3>
        <span>${user.userId} <span class="user-card-role ${user.role}">${roleDisplayNames[user.role] || user.role}</span></span>
      </div>
    </div>
    <div class="user-card-info">
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
      <p><strong>${user.role === 'student' ? 'Program' : user.role === 'teacher' ? 'Department' : 'Role'}:</strong> 
        ${user.role === 'student' ? user.program : 
          user.role === 'teacher' ? user.department : 
          user.adminRole}
      </p>
    </div>
  `;
  
  return card;
}

/**
 * Select a user and display their profile for editing
 * @param {Object} user - The selected user object
 */
function selectUser(user) {
  // Switch to edit profile tab
  switchTab('edit-profile');
  
  // Populate form with user data
  populateUserForm(user);
}

/**
 * Populate the user form with the selected user's data
 * @param {Object} user - The user data object
 */
function populateUserForm(user) {
  // Set user ID in hidden field
  document.getElementById('user-id').value = user.id;
  
  // Common fields
  const commonFields = [
    'firstName', 'middleName', 'lastName', 'email', 'phone', 
    'dateOfBirth', 'gender', 'nationality', 'address'
  ];
  
  // Set values for common fields
  commonFields.forEach(field => {
    const element = document.getElementById(field.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element && user[field] !== undefined) {
      element.value = user[field];
    }
  });
  
  // Set avatar if available
  const avatarPreview = document.getElementById('avatar-preview-img');
  if (avatarPreview) {
    avatarPreview.src = user.avatarUrl || 'images/default-avatar.png';
  }
  
  // Show/hide role-specific fields and set values
  const studentFields = document.getElementById('student-fields');
  const teacherFields = document.getElementById('teacher-fields');
  const adminFields = document.getElementById('admin-fields');
  
  // Hide all role-specific fields first
  if (studentFields) studentFields.style.display = 'none';
  if (teacherFields) teacherFields.style.display = 'none';
  if (adminFields) adminFields.style.display = 'none';
  
  // Show and populate fields based on user role
  if (user.role === 'student' && studentFields) {
    studentFields.style.display = 'block';
    
    // Set student-specific fields
    document.getElementById('student-id').value = user.userId;
    document.getElementById('program').value = user.program || '';
    document.getElementById('year-level').value = user.yearLevel || '';
    document.getElementById('section').value = user.section || '';
    document.getElementById('guardian-name').value = user.guardianName || '';
    document.getElementById('guardian-contact').value = user.guardianContact || '';
  } 
  else if (user.role === 'teacher' && teacherFields) {
    teacherFields.style.display = 'block';
    
    // Set teacher-specific fields
    document.getElementById('employee-id').value = user.userId;
    document.getElementById('department').value = user.department || '';
    document.getElementById('position').value = user.position || '';
    document.getElementById('employment-type').value = user.employmentType || '';
    document.getElementById('specialization').value = user.specialization || '';
  } 
  else if (user.role === 'admin' && adminFields) {
    adminFields.style.display = 'block';
    
    // Set admin-specific fields
    document.getElementById('admin-id').value = user.userId;
    document.getElementById('admin-role').value = user.adminRole || '';
    document.getElementById('access-level').value = user.accessLevel || '';
    document.getElementById('department-assignment').value = user.departmentAssignment || '';
  }
}

/**
 * Set up form validation and submission handling
 */
function setupFormHandling() {
  const form = document.getElementById('profile-form');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate the form
      if (validateForm()) {
        // Submit the form if valid
        submitProfileForm();
      }
    });
  }
}

/**
 * Validate the profile form
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
  let isValid = true;
  let firstError = null;
  
  // Required fields to validate
  const requiredFields = {
    'first-name': 'First name is required',
    'last-name': 'Last name is required',
    'date-of-birth': 'Date of birth is required',
    'gender': 'Gender is required',
    'email': 'Email address is required'
  };
  
  // Validate required fields
  for (const [fieldId, errorMessage] of Object.entries(requiredFields)) {
    const field = document.getElementById(fieldId);
    if (field && !field.value.trim()) {
      isValid = false;
      showValidationError(field, errorMessage);
      
      if (!firstError) {
        firstError = field;
      }
    } else if (field) {
      removeValidationError(field);
    }
  }
  
  // Validate email format
  const emailField = document.getElementById('email');
  if (emailField && emailField.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value)) {
      isValid = false;
      showValidationError(emailField, 'Please enter a valid email address');
      
      if (!firstError) {
        firstError = emailField;
      }
    }
  }
  
  // Validate phone format if provided
  const phoneField = document.getElementById('phone');
  if (phoneField && phoneField.value.trim()) {
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phoneField.value)) {
      isValid = false;
      showValidationError(phoneField, 'Please enter a valid phone number (10-15 digits)');
      
      if (!firstError) {
        firstError = phoneField;
      }
    }
  }
  
  // Role-specific validations
  const userId = document.getElementById('user-id').value;
  const user = sampleUsers.find(u => u.id === userId);
  
  if (user) {
    if (user.role === 'student') {
      // Student-specific validations
      if (document.getElementById('program') && !document.getElementById('program').value) {
        isValid = false;
        showValidationError(document.getElementById('program'), 'Program/Course is required');
        
        if (!firstError) {
          firstError = document.getElementById('program');
        }
      }
      
      if (document.getElementById('year-level') && !document.getElementById('year-level').value) {
        isValid = false;
        showValidationError(document.getElementById('year-level'), 'Year level is required');
        
        if (!firstError) {
          firstError = document.getElementById('year-level');
        }
      }
    } 
    else if (user.role === 'teacher') {
      // Teacher-specific validations
      if (document.getElementById('department') && !document.getElementById('department').value) {
        isValid = false;
        showValidationError(document.getElementById('department'), 'Department is required');
        
        if (!firstError) {
          firstError = document.getElementById('department');
        }
      }
    } 
    else if (user.role === 'admin') {
      // Admin-specific validations
      if (document.getElementById('admin-role') && !document.getElementById('admin-role').value) {
        isValid = false;
        showValidationError(document.getElementById('admin-role'), 'Administrative role is required');
        
        if (!firstError) {
          firstError = document.getElementById('admin-role');
        }
      }
      
      if (document.getElementById('access-level') && !document.getElementById('access-level').value) {
        isValid = false;
        showValidationError(document.getElementById('access-level'), 'Access level is required');
        
        if (!firstError) {
          firstError = document.getElementById('access-level');
        }
      }
    }
  }
  
  // Focus on the first error field
  if (firstError) {
    firstError.focus();
  }
  
  return isValid;
}

/**
 * Show validation error for a field
 * @param {HTMLElement} field - The field with the error
 * @param {string} message - The error message
 */
function showValidationError(field, message) {
  // Remove any existing error
  removeValidationError(field);
  
  // Create and add the error message
  const errorElement = document.createElement('span');
  errorElement.className = 'validation-error';
  errorElement.textContent = message;
  
  // Add after the field
  field.parentNode.insertBefore(errorElement, field.nextSibling);
  
  // Add error class to the field
  field.classList.add('error-field');
}

/**
 * Remove validation error from a field
 * @param {HTMLElement} field - The field to remove error from
 */
function removeValidationError(field) {
  // Find any error messages
  const errorElement = field.parentNode.querySelector('.validation-error');
  
  // Remove if found
  if (errorElement) {
    errorElement.remove();
  }
  
  // Remove error class from the field
  field.classList.remove('error-field');
}

/**
 * Submit the profile form
 */
function submitProfileForm() {
  // Show progress indicator
  const progressIndicator = document.getElementById('progress-indicator');
  if (progressIndicator) {
    progressIndicator.style.display = 'block';
  }
  
  // Hide any previous messages
  hideMessages();
  
  // Get form data
  const userId = document.getElementById('user-id').value;
  const user = sampleUsers.find(u => u.id === userId);
  
  if (!user) {
    showErrorMessage('User not found');
    return;
  }
  
  // Common fields
  const commonFields = [
    { id: 'first-name', property: 'firstName' },
    { id: 'middle-name', property: 'middleName' },
    { id: 'last-name', property: 'lastName' },
    { id: 'email', property: 'email' },
    { id: 'phone', property: 'phone' },
    { id: 'date-of-birth', property: 'dateOfBirth' },
    { id: 'gender', property: 'gender' },
    { id: 'nationality', property: 'nationality' },
    { id: 'address', property: 'address' }
  ];
  
  // Update common fields
  commonFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      user[field.property] = element.value;
    }
  });
  
  // Update role-specific fields
  if (user.role === 'student') {
    user.program = document.getElementById('program').value;
    user.yearLevel = document.getElementById('year-level').value;
    user.section = document.getElementById('section').value;
    user.guardianName = document.getElementById('guardian-name').value;
    user.guardianContact = document.getElementById('guardian-contact').value;
  } 
  else if (user.role === 'teacher') {
    user.department = document.getElementById('department').value;
    user.position = document.getElementById('position').value;
    user.employmentType = document.getElementById('employment-type').value;
    user.specialization = document.getElementById('specialization').value;
  } 
  else if (user.role === 'admin') {
    user.adminRole = document.getElementById('admin-role').value;
    user.accessLevel = document.getElementById('access-level').value;
    user.departmentAssignment = document.getElementById('department-assignment').value;
  }
  
  // In a real implementation, we would send to the API
  /*
  fetch('/api/users/' + userId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SessionManager.getToken()}`
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    if (data.status === 'success') {
      showSuccessMessage();
      loadUsers(); // Reload user list
    } else {
      showErrorMessage(data.message || 'Failed to update user profile');
    }
  })
  .catch(error => {
    console.error('Error updating profile:', error);
    
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    showErrorMessage('An error occurred while processing your request');
  });
  */
  
  // For demo purposes, simulate API call
  console.log('Profile update request:', user);
  
  setTimeout(() => {
    // Update user in sample data (for demo only)
    const userIndex = sampleUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      sampleUsers[userIndex] = { ...user };
    }
    
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    // Show success message
    showSuccessMessage();
    
    // Reload user list
    loadUsers();
    
    // Log the action
    logAccessEvent('user_profile_update', { userId: user.userId });
  }, 1500);
}

/**
 * Reset the profile form
 */
function resetForm() {
  const form = document.getElementById('profile-form');
  if (form) {
    form.reset();
  }
  
  // Clear any validation errors
  const errorMessages = document.querySelectorAll('.validation-error');
  errorMessages.forEach(error => {
    error.remove();
  });
  
  // Remove error classes
  const errorFields = document.querySelectorAll('.error-field');
  errorFields.forEach(field => {
    field.classList.remove('error-field');
  });
  
  // Hide role-specific fields
  const roleSpecificFields = [
    document.getElementById('student-fields'),
    document.getElementById('teacher-fields'),
    document.getElementById('admin-fields')
  ];
  
  roleSpecificFields.forEach(fieldset => {
    if (fieldset) {
      fieldset.style.display = 'none';
    }
  });
  
  // Switch back to browse tab
  switchTab('browse-users');
}

/**
 * Set up user search functionality
 */
function setupSearch() {
  const searchInput = document.getElementById('user-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', searchUsers);
  }
}

/**
 * Search users based on search input
 */
function searchUsers() {
  const searchInput = document.getElementById('user-search');
  
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  // If search term is empty, show all users
  if (!searchTerm) {
    loadUsers();
    return;
  }
  
  // Filter users based on search term
  const filteredUsers = sampleUsers.filter(user => {
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      (user.middleName && user.middleName.toLowerCase().includes(searchTerm)) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.userId.toLowerCase().includes(searchTerm)
    );
  });
  
  // Load filtered users
  loadUsers(filteredUsers);
}

/**
 * Switch between tabs
 * @param {string} tabId - The ID of the tab to switch to
 */
function switchTab(tabId) {
  // Update tab controls
  const tabControls = document.querySelectorAll('.tab-control');
  tabControls.forEach(control => {
    if (control.dataset.tab === tabId) {
      control.classList.add('active');
    } else {
      control.classList.remove('active');
    }
  });
  
  // Update tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    if (content.id === tabId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

/**
 * Preview avatar image before upload
 * @param {HTMLInputElement} input - The file input element
 */
function previewAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const previewImg = document.getElementById('avatar-preview-img');
      if (previewImg) {
        previewImg.src = e.target.result;
      }
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

/**
 * Show success message
 */
function showSuccessMessage() {
  const successMessage = document.getElementById('success-message');
  if (successMessage) {
    successMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }
}

/**
 * Show error message
 * @param {string} message - The error message to show
 */
function showErrorMessage(message) {
  const errorMessage = document.getElementById('error-message');
  const errorDetails = document.getElementById('error-details');
  
  if (errorMessage && errorDetails) {
    errorDetails.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
}

/**
 * Hide all messages
 */
function hideMessages() {
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  if (successMessage) {
    successMessage.style.display = 'none';
  }
  
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
}

/**
 * Log access and security events
 * @param {string} eventType - The type of event
 * @param {Object} details - Additional details about the event
 */
function logAccessEvent(eventType, details = {}) {
  // Log to security module if available
  if (window.SecurityModule && window.SecurityModule.logEvent) {
    SecurityModule.logEvent(eventType, details);
  }
  
  // Log to console
  console.log(`[EVENT] ${eventType}`, details);
}
