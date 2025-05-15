/**
 * Password Change Module
 * Handles password change functionality with security validation
 */

// Initialize the password change module
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
      SessionManager.redirectToLogin('You must be logged in to change your password.');
      return;
    }
  }
  
  // Set up form validation
  setupFormValidation();
  
  // Set up password strength meter and requirement checks
  setupPasswordStrengthMeter();
  
  // Log page access
  logAccessEvent('password_change_page_access');
});

/**
 * Set up form validation for the password change form
 */
function setupFormValidation() {
  const form = document.getElementById('password-form');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate the form
      if (validateForm()) {
        // Submit the form if valid
        submitPasswordChangeForm();
      }
    });
  }
}

/**
 * Validate the password change form
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
  let isValid = true;
  let firstError = null;
  
  // Validate current password
  const currentPasswordField = document.getElementById('current-password');
  if (currentPasswordField && !currentPasswordField.value.trim()) {
    isValid = false;
    showValidationError(currentPasswordField, 'Please enter your current password');
    
    if (!firstError) {
      firstError = currentPasswordField;
    }
  }
  
  // Validate new password
  const newPasswordField = document.getElementById('new-password');
  if (newPasswordField && newPasswordField.value.trim()) {
    const passwordStrength = checkPasswordStrength(newPasswordField.value);
    if (passwordStrength.score < 3) {
      isValid = false;
      showValidationError(newPasswordField, 'Password is too weak. ' + passwordStrength.feedback);
      
      if (!firstError) {
        firstError = newPasswordField;
      }
    }
  } else if (newPasswordField) {
    isValid = false;
    showValidationError(newPasswordField, 'Please enter a new password');
    
    if (!firstError) {
      firstError = newPasswordField;
    }
  }
  
  // Validate password confirmation
  const confirmPasswordField = document.getElementById('confirm-password');
  if (confirmPasswordField && confirmPasswordField.value.trim()) {
    if (newPasswordField && newPasswordField.value.trim() && 
        newPasswordField.value !== confirmPasswordField.value) {
      isValid = false;
      showValidationError(confirmPasswordField, 'Passwords do not match');
      
      if (!firstError) {
        firstError = confirmPasswordField;
      }
    }
  } else if (confirmPasswordField) {
    isValid = false;
    showValidationError(confirmPasswordField, 'Please confirm your new password');
    
    if (!firstError) {
      firstError = confirmPasswordField;
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
  
  // Add after the field's wrapper (for password fields)
  const wrapper = field.closest('.password-field-wrapper');
  if (wrapper) {
    wrapper.parentNode.insertBefore(errorElement, wrapper.nextSibling);
  } else {
    // Add after the field itself
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
  
  // Add error class to the field
  field.classList.add('error-field');
}

/**
 * Remove validation error from a field
 * @param {HTMLElement} field - The field to remove error from
 */
function removeValidationError(field) {
  // Find any error messages
  const wrapper = field.closest('.password-field-wrapper');
  const parent = wrapper ? wrapper.parentNode : field.parentNode;
  const errorElement = parent.querySelector('.validation-error');
  
  // Remove if found
  if (errorElement) {
    errorElement.remove();
  }
  
  // Remove error class from the field
  field.classList.remove('error-field');
}

/**
 * Submit the password change form
 */
function submitPasswordChangeForm() {
  // Show progress indicator
  const progressIndicator = document.getElementById('progress-indicator');
  if (progressIndicator) {
    progressIndicator.style.display = 'block';
  }
  
  // Hide any previous messages
  hideMessages();
  
  // Get form data
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  
  // In a real implementation, we would send to the API
  /*
  fetch('/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SessionManager.getToken()}`
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword
    })
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
      showErrorMessage(data.message || 'Failed to change password');
    }
  })
  .catch(error => {
    console.error('Error changing password:', error);
    
    // Hide progress indicator
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    showErrorMessage('An error occurred while processing your request');
  });
  */
  
  // For demo purposes, simulate API call
  console.log('Password change request:', { currentPassword: '********', newPassword: '********' });
  
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
    logAccessEvent('password_change_success');
  }, 1500);
}

/**
 * Reset the password change form
 */
function resetForm() {
  const form = document.getElementById('password-form');
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
  
  // Reset password strength meter and requirement checks
  const passwordField = document.getElementById('new-password');
  if (passwordField) {
    // Reset strength meter
    const meter = document.getElementById('password-meter');
    if (meter) {
      meter.style.width = '0%';
      meter.style.backgroundColor = '#eee';
    }
    
    // Reset feedback
    const feedback = document.getElementById('password-feedback');
    if (feedback) {
      feedback.textContent = 'Please enter a new password';
    }
    
    // Reset requirement checks
    updatePasswordRequirements('');
  }
}

/**
 * Set up password strength meter and requirement checks
 */
function setupPasswordStrengthMeter() {
  const passwordField = document.getElementById('new-password');
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
      
      // Update requirement checks
      updatePasswordRequirements(password);
      
      // Check if confirm password matches
      checkPasswordMatch();
    });
    
    // Set up confirm password matching
    const confirmPasswordField = document.getElementById('confirm-password');
    if (confirmPasswordField) {
      confirmPasswordField.addEventListener('input', checkPasswordMatch);
    }
  }
}

/**
 * Check if the new password and confirm password match
 */
function checkPasswordMatch() {
  const newPasswordField = document.getElementById('new-password');
  const confirmPasswordField = document.getElementById('confirm-password');
  
  if (newPasswordField && confirmPasswordField) {
    const newPassword = newPasswordField.value;
    const confirmPassword = confirmPasswordField.value;
    
    // Only check if both fields have values
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        showValidationError(confirmPasswordField, 'Passwords do not match');
      } else {
        removeValidationError(confirmPasswordField);
      }
    }
  }
}

/**
 * Update the password requirement checks based on the current password
 * @param {string} password - The password to check
 */
function updatePasswordRequirements(password) {
  // Check each requirement
  const lengthCheck = password.length >= 8;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const numberCheck = /[0-9]/.test(password);
  const specialCheck = /[^a-zA-Z0-9]/.test(password);
  
  // Update check icons
  updateCheckIcon('length-check', lengthCheck);
  updateCheckIcon('uppercase-check', uppercaseCheck);
  updateCheckIcon('lowercase-check', lowercaseCheck);
  updateCheckIcon('number-check', numberCheck);
  updateCheckIcon('special-check', specialCheck);
}

/**
 * Update a check icon based on whether the requirement is met
 * @param {string} id - The ID of the check element
 * @param {boolean} isValid - Whether the requirement is met
 */
function updateCheckIcon(id, isValid) {
  const checkElement = document.getElementById(id);
  if (!checkElement) return;
  
  const iconElement = checkElement.querySelector('.check-icon');
  if (!iconElement) return;
  
  if (isValid) {
    iconElement.classList.remove('invalid');
    iconElement.classList.add('valid');
    iconElement.textContent = '✓';
  } else {
    iconElement.classList.remove('valid');
    iconElement.classList.add('invalid');
    iconElement.textContent = '✕';
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
  
  // Common patterns check
  const commonPatterns = [
    'password', '123456', 'qwerty', 'admin', 'welcome', 
    'letmein', 'monkey', 'abc123', 'football', 'iloveyou'
  ];
  
  // Check if password contains common patterns
  for (const pattern of commonPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      score = Math.max(0, score - 2);
      break;
    }
  }
  
  // Repetitive character check
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
  }
  
  // Sequential character check
  const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789'];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const chunk = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(chunk)) {
        score = Math.max(0, score - 1);
        break;
      }
    }
  }
  
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
 * Toggle password visibility
 * @param {string} fieldId - The ID of the password field
 */
function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  const toggle = field.parentElement.querySelector('.toggle-password');
  
  if (field.type === 'password') {
    field.type = 'text';
    toggle.textContent = '🔒';
  } else {
    field.type = 'password';
    toggle.textContent = '👁️';
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
