/**
 * User Registration Module
 * Handles the registration of new users in the system (admin-only)
 */

// Initialize the registration module
document.addEventListener('DOMContentLoaded', function() {
  // Initialize security modules if available
  if (window.SecurityModule) {
    SecurityModule.init();
  }
  
  if (window.SessionManager) {
    SessionManager.init();
    
    // Check if user is logged in and has admin privileges
    const currentUser = SessionManager.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      // Redirect to login page with appropriate message
      SessionManager.redirectToLogin('You must be logged in as an administrator to access this page.');
      return;
    }
  }
  
  // Load required scripts
  loadScript('js/api.js')
    .then(() => loadScript('js/form-validator.js'))
    .then(() => {
      // Initialize the registration form
      initRegistrationForm();
    })
    .catch(error => {
      console.error('Error loading scripts:', error);
    });
});

/**
 * Load a script dynamically
 * @param {string} src - The script source
 * @returns {Promise} - A promise that resolves when the script is loaded
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initialize the registration form
 */
function initRegistrationForm() {
  // Set up form validation
  setupFormValidation();
  
  // Load dynamic data (programs, departments)
  loadDynamicData();
  
  // Show student fields by default
  switchUserType('student');
  
  // Set up password strength meter
  setupPasswordStrengthMeter();
  
  // Log page access
  logAccessEvent('user_registration_page_access');
}

/**
 * Set up form validation for the registration form
 */
function setupFormValidation() {
  const form = document.getElementById('registration-form');
  
  if (form && window.FormValidator) {
    // Create form validator instance
    const validator = new FormValidator(form);
    
    // Add validation rules
    validator.addRules('firstName', [
      ValidationRules.required('First name is required'),
      ValidationRules.minLength(2, 'First name must be at least 2 characters long'),
      ValidationRules.maxLength(50, 'First name must not exceed 50 characters')
    ]);
    
    validator.addRules('lastName', [
      ValidationRules.required('Last name is required'),
      ValidationRules.minLength(2, 'Last name must be at least 2 characters long'),
      ValidationRules.maxLength(50, 'Last name must not exceed 50 characters')
    ]);
    
    validator.addRules('email', [
      ValidationRules.required('Email is required'),
      ValidationRules.email('Please enter a valid email address')
    ]);
    
    validator.addRules('password', [
      ValidationRules.required('Password is required'),
      ValidationRules.custom('passwordStrength', 'Password is too weak')
    ]);
    
    validator.addRules('confirmPassword', [
      ValidationRules.required('Please confirm your password'),
      ValidationRules.match('password', 'Passwords do not match')
    ]);
    
    validator.addRules('dateOfBirth', [
      ValidationRules.required('Date of birth is required')
    ]);
    
    validator.addRules('gender', [
      ValidationRules.required('Gender is required')
    ]);
    
    // Student-specific rules
    validator.addRules('studentId', [
      ValidationRules.studentId('Student ID must follow the format: mYY-XXXX-XXX (e.g., m23-1470-578)')
    ]);
    
    validator.addRules('program', [
      ValidationRules.required('Program is required')
    ]);
    
    validator.addRules('yearLevel', [
      ValidationRules.required('Year level is required')
    ]);
    
    // Teacher-specific rules
    validator.addRules('department', [
      ValidationRules.required('Department is required')
    ]);
    
    validator.addRules('employmentType', [
      ValidationRules.required('Employment type is required')
    ]);
    
    // Admin-specific rules
    validator.addRules('adminRole', [
      ValidationRules.required('Administrative role is required')
    ]);
    
    validator.addRules('accessLevel', [
      ValidationRules.required('Access level is required')
    ]);
    
    // Add custom validators
    validator.addCustomValidator('passwordStrength', passwordStrengthValidator);
    
    // Save validator instance
    form.validator = validator;
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate the form
      if (validator.validateAll()) {
        // Submit the form if valid
        submitRegistrationForm();
      }
    });
  } else {
    // Fallback to basic validation if FormValidator is not available
    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate the form using legacy method
        if (validateForm()) {
          // Submit the form if valid
          submitRegistrationForm();
        }
      });
    }
  }
}

/**
 * Validate the registration form
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
  let isValid = true;
  let firstError = null;
  
  // Get user type
  const userType = document.getElementById('user-type').value;
  
  // Validate common fields
  const requiredFields = [
    'first-name', 'last-name', 'email', 'date-of-birth', 
    'gender', 'username', 'password', 'confirm-password'
  ];
  
  // Add type-specific required fields
  if (userType === 'student') {
    requiredFields.push('student-id', 'program', 'year-level');
  } else if (userType === 'teacher') {
    requiredFields.push('employee-id', 'department');
  } else if (userType === 'admin') {
    requiredFields.push('admin-id', 'admin-role', 'access-level');
  }
  
  // Check each required field
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Remove any existing error
    removeValidationError(field);
    
    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      showValidationError(field, 'This field is required');
      
      // Store the first error for focus
      if (!firstError) {
        firstError = field;
      }
    }
  });
  
  // Validate email format
  const emailField = document.getElementById('email');
  if (emailField && emailField.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      showValidationError(emailField, 'Please enter a valid email address');
      
      if (!firstError) {
        firstError = emailField;
      }
    }
  }
  
  // Validate password strength
  const passwordField = document.getElementById('password');
  if (passwordField && passwordField.value.trim()) {
    const passwordStrength = checkPasswordStrength(passwordField.value);
    if (passwordStrength.score < 2) {
      isValid = false;
      showValidationError(passwordField, 'Password is too weak. ' + passwordStrength.feedback);
      
      if (!firstError) {
        firstError = passwordField;
      }
    }
  }
  
  // Validate password confirmation
  const passwordConfirmField = document.getElementById('confirm-password');
  if (passwordField && passwordConfirmField && 
      passwordField.value.trim() && passwordConfirmField.value.trim()) {
    if (passwordField.value !== passwordConfirmField.value) {
      isValid = false;
      showValidationError(passwordConfirmField, 'Passwords do not match');
      
      if (!firstError) {
        firstError = passwordConfirmField;
      }
    }
  }
  
  // Validate student ID format
  if (userType === 'student') {
    const studentIdField = document.getElementById('student-id');
    if (studentIdField && studentIdField.value.trim()) {
      const studentIdRegex = /^[a-zA-Z][0-9]{2}-[0-9]{4}-[0-9]{3}$/;
      if (!studentIdRegex.test(studentIdField.value)) {
        isValid = false;
        showValidationError(studentIdField, 'Student ID must be in the format mYY-XXXX-XXX');
        
        if (!firstError) {
          firstError = studentIdField;
        }
      }
    }
  }
  
  // Validate teacher ID format
  if (userType === 'teacher') {
    const employeeIdField = document.getElementById('employee-id');
    if (employeeIdField && employeeIdField.value.trim()) {
      const employeeIdRegex = /^[a-zA-Z][0-9]{4}-[0-9]{4}$/;
      if (!employeeIdRegex.test(employeeIdField.value)) {
        isValid = false;
        showValidationError(employeeIdField, 'Employee ID must be in the format tYYYY-XXXX');
        
        if (!firstError) {
          firstError = employeeIdField;
        }
      }
    }
  }
  
  // Validate admin ID format
  if (userType === 'admin') {
    const adminIdField = document.getElementById('admin-id');
    if (adminIdField && adminIdField.value.trim()) {
      const adminIdRegex = /^[a-zA-Z][0-9]{4}-[0-9]{4}$/;
      if (!adminIdRegex.test(adminIdField.value)) {
        isValid = false;
        showValidationError(adminIdField, 'Admin ID must be in the format aYYYY-XXXX');
        
        if (!firstError) {
          firstError = adminIdField;
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
 * Submit the registration form to the API
 */
function submitRegistrationForm() {
  // Show progress indicator
  const progressIndicator = document.getElementById('progress-indicator');
  if (progressIndicator) {
    progressIndicator.style.display = 'block';
  }
  
  // Hide any previous messages
  hideMessages();
  
  // Get form data
  const formData = getFormData();
  
  // In a real implementation, we would send to the API
  /*
  fetch('/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SessionManager.getToken()}`
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    if (data.status === 'success') {
      showSuccessMessage();
      resetForm();
    } else {
      showErrorMessage(data.message || 'Failed to register user');
    }
  })
  .catch(error => {
    console.error('Error registering user:', error);
    
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    showErrorMessage('An error occurred while processing your request');
  });
  */
  
  // For demo purposes, simulate API call
  console.log('Registration data:', formData);
  
  setTimeout(() => {
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    // Show success message
    showSuccessMessage();
    
    // Reset the form
    resetForm();
    
    // Log the action
    logAccessEvent('user_registration_success', {
      userType: formData.userType,
      username: formData.username,
      email: formData.email
    });
  }, 1500);
}

/**
 * Get all form data as an object
 * @returns {Object} Form data object
 */
function getFormData() {
  const formData = {};
  const form = document.getElementById('registration-form');
  
  // Get all input, select, and textarea elements
  const elements = form.querySelectorAll('input, select, textarea');
  
  // Process each element
  elements.forEach(element => {
    // Skip elements without a name
    if (!element.name) return;
    
    // Get element value
    let value = element.value.trim();
    
    // Special handling for specific field types
    if (element.type === 'checkbox') {
      value = element.checked;
    } else if (element.type === 'radio') {
      if (!element.checked) return;
    } else if (element.type === 'number') {
      value = parseFloat(value);
    }
    
    // Add to form data
    formData[element.name] = value;
  });
  
  return formData;
}

/**
 * Switch between user types (student, teacher, admin)
 * @param {string} type - The user type to switch to
 */
function switchUserType(type) {
  // Update hidden input
  const userTypeInput = document.getElementById('user-type');
  if (userTypeInput) {
    userTypeInput.value = type;
  }
  
  // Update tab buttons
  const tabs = document.querySelectorAll('.user-type-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-type') === type) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Hide all conditional sections
  const sections = document.querySelectorAll('.conditional-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show the selected section
  const sectionToShow = document.getElementById(`${type}-fields`);
  if (sectionToShow) {
    sectionToShow.style.display = 'block';
  }
  
  // Update email note based on user type
  updateEmailNote(type);
}

/**
 * Update the email note based on user type
 * @param {string} type - The user type
 */
function updateEmailNote(type) {
  const emailNote = document.getElementById('email-note');
  if (!emailNote) return;
  
  if (type === 'student') {
    emailNote.textContent = 'Student email should be in the format: mYY-XXXX-XXX@manila.uphsl.edu.ph';
  } else if (type === 'teacher') {
    emailNote.textContent = 'Teacher email should be in the format: name@faculty.uphsl.edu.ph';
  } else if (type === 'admin') {
    emailNote.textContent = 'Admin email should be in the format: name@admin.uphsl.edu.ph';
  } else {
    emailNote.textContent = 'Email will be used for login and notifications';
  }
}

/**
 * Set up password strength meter
 */
function setupPasswordStrengthMeter() {
  const passwordField = document.getElementById('password');
  const meter = document.getElementById('password-meter');
  const feedback = document.getElementById('password-feedback');
  
  if (passwordField && meter && feedback) {
    passwordField.addEventListener('input', function() {
      const password = this.value;
      const strength = checkPasswordStrength(password);
      
      // Update meter width and color
      meter.style.width = `${(strength.score * 25)}%`;
      
      // Set color based on strength
      if (strength.score === 0) {
        meter.style.backgroundColor = '#dc3545'; // Red
      } else if (strength.score === 1) {
        meter.style.backgroundColor = '#ffc107'; // Yellow
      } else if (strength.score === 2) {
        meter.style.backgroundColor = '#17a2b8'; // Blue
      } else if (strength.score === 3) {
        meter.style.backgroundColor = '#28a745'; // Green
      } else {
        meter.style.backgroundColor = '#28a745'; // Green (stronger)
      }
      
      // Update feedback
      feedback.textContent = strength.feedback || 'Strong password';
    });
  }
}

/**
 * Check password strength
 * @param {string} password - The password to check
 * @returns {Object} Object containing score and feedback
 */
function checkPasswordStrength(password) {
  // Simple password strength check
  // In a real implementation, you might use a more sophisticated library
  
  const result = {
    score: 0,
    feedback: ''
  };
  
  // Empty password
  if (!password) {
    result.feedback = 'Please enter a password';
    return result;
  }
  
  // Check length
  if (password.length < 8) {
    result.score = 0;
    result.feedback = 'Password is too short (at least 8 characters)';
    return result;
  }
  
  // Calculate score
  let score = 0;
  
  // Length bonus
  score += Math.min(2, Math.floor(password.length / 8));
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1; // Lowercase letters
  if (/[A-Z]/.test(password)) score += 1; // Uppercase letters
  if (/[0-9]/.test(password)) score += 1; // Numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // Special characters
  
  // Normalize score to 0-4 range
  result.score = Math.min(4, score);
  
  // Set feedback based on score
  if (result.score === 0) {
    result.feedback = 'Very weak password';
  } else if (result.score === 1) {
    result.feedback = 'Weak password';
  } else if (result.score === 2) {
    result.feedback = 'Fair password';
  } else if (result.score === 3) {
    result.feedback = 'Good password';
  } else {
    result.feedback = 'Strong password';
  }
  
  return result;
}

/**
 * Reset the registration form
 */
function resetForm() {
  const form = document.getElementById('registration-form');
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
  
  // Reset password strength meter
  const meter = document.getElementById('password-meter');
  const feedback = document.getElementById('password-feedback');
  
  if (meter) {
    meter.style.width = '0%';
  }
  
  if (feedback) {
    feedback.textContent = 'Please enter a password';
  }
  
  // Hide messages
  hideMessages();
  
  // Switch back to student type
  switchUserType('student');
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
 * Load dynamic data (programs, departments)
 */
function loadDynamicData() {
  // Load programs
  loadPrograms();
  
  // Load departments
  loadDepartments();
}

/**
 * Load programs for the student form
 */
function loadPrograms() {
  const programSelect = document.getElementById('program');
  if (!programSelect) return;
  
  // In a real implementation, we would fetch from the API
  /*
  fetch('/api/academic/programs', {
    headers: {
      'Authorization': `Bearer ${SessionManager.getToken()}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // Clear existing options except the first one
    while (programSelect.options.length > 1) {
      programSelect.remove(1);
    }
    
    // Add program options
    data.forEach(program => {
      const option = document.createElement('option');
      option.value = program._id;
      option.textContent = program.name;
      programSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error loading programs:', error);
  });
  */
  
  // For demo purposes, use mock data
  const mockPrograms = [
    { _id: 'prog1', name: 'Bachelor of Science in Information Technology' },
    { _id: 'prog2', name: 'Bachelor of Science in Computer Science' },
    { _id: 'prog3', name: 'Bachelor of Science in Accounting' },
    { _id: 'prog4', name: 'Bachelor of Science in Business Administration' },
    { _id: 'prog5', name: 'Bachelor of Elementary Education' },
    { _id: 'prog6', name: 'Bachelor of Secondary Education' }
  ];
  
  // Clear existing options except the first one
  while (programSelect.options.length > 1) {
    programSelect.remove(1);
  }
  
  // Add program options
  mockPrograms.forEach(program => {
    const option = document.createElement('option');
    option.value = program._id;
    option.textContent = program.name;
    programSelect.appendChild(option);
  });
}

/**
 * Load departments for the teacher form
 */
function loadDepartments() {
  const departmentSelect = document.getElementById('department');
  const departmentAssignmentSelect = document.getElementById('department-assignment');
  
  if (!departmentSelect && !departmentAssignmentSelect) return;
  
  // In a real implementation, we would fetch from the API
  /*
  fetch('/api/departments', {
    headers: {
      'Authorization': `Bearer ${SessionManager.getToken()}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const departments = data;
    
    // Update teacher department select
    if (departmentSelect) {
      // Clear existing options except the first one
      while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
      }
      
      // Add department options
      departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept._id;
        option.textContent = dept.name;
        departmentSelect.appendChild(option);
      });
    }
    
    // Update admin department assignment select
    if (departmentAssignmentSelect) {
      // Clear existing options except the first one
      while (departmentAssignmentSelect.options.length > 1) {
        departmentAssignmentSelect.remove(1);
      }
      
      // Add department options
      departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept._id;
        option.textContent = dept.name;
        departmentAssignmentSelect.appendChild(option);
      });
    }
  })
  .catch(error => {
    console.error('Error loading departments:', error);
  });
  */
  
  // For demo purposes, use mock data
  const mockDepartments = [
    { _id: 'dept1', name: 'Computer Studies Department' },
    { _id: 'dept2', name: 'Business Administration Department' },
    { _id: 'dept3', name: 'Education Department' },
    { _id: 'dept4', name: 'Arts and Sciences Department' },
    { _id: 'dept5', name: 'Engineering Department' }
  ];
  
  // Update teacher department select
  if (departmentSelect) {
    // Clear existing options except the first one
    while (departmentSelect.options.length > 1) {
      departmentSelect.remove(1);
    }
    
    // Add department options
    mockDepartments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept._id;
      option.textContent = dept.name;
      departmentSelect.appendChild(option);
    });
  }
  
  // Update admin department assignment select
  if (departmentAssignmentSelect) {
    // Clear existing options except the first one
    while (departmentAssignmentSelect.options.length > 1) {
      departmentAssignmentSelect.remove(1);
    }
    
    // Add department options
    mockDepartments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept._id;
      option.textContent = dept.name;
      departmentAssignmentSelect.appendChild(option);
    });
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
