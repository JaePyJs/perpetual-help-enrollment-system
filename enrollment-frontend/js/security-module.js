/**
 * Security Module for School Enrollment System
 * This module handles input validation, session management, and access logging
 */

// Security configuration
const securityConfig = {
    sessionTimeout: 30, // Minutes
    maxLoginAttempts: 5,
    passwordRequirements: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecial: true
    },
    accessLevels: {
        student: 1,
        teacher: 2,
        admin: 3
    }
};

// Initialize the security module
function initSecurity() {
    // Check if session exists
    checkSession();
    
    // Set up form validation
    setupFormValidation();
    
    // Set up session timeout monitoring
    setupSessionMonitoring();
    
    console.log("Security module initialized");
}

// ===== INPUT VALIDATION =====

/**
 * Set up form validation for all forms in the application
 */
function setupFormValidation() {
    // Find all forms
    const forms = document.querySelectorAll('form');
    
    // Add validation to each form
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Don't validate forms with the 'no-validate' class
            if (form.classList.contains('no-validate')) return;
            
            // Validate the form
            const isValid = validateForm(form);
            
            // Prevent submission if validation fails
            if (!isValid) {
                event.preventDefault();
                return false;
            }
        });
    });
}

/**
 * Validate an entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;
    
    // Check each input in the form
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Skip inputs with the 'no-validate' class
        if (input.classList.contains('no-validate')) return;
        
        // Validate based on the input's type and attributes
        const inputValid = validateInput(input);
        if (!inputValid) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate a single input element
 * @param {HTMLElement} input - The input to validate
 * @returns {boolean} - Whether the input is valid
 */
function validateInput(input) {
    // Reset previous validation errors
    removeValidationError(input);
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
        showValidationError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            showValidationError(input, 'Please enter a valid email address');
            return false;
        }
        
        // UPHSL specific email validation for students
        if (input.dataset.emailType === 'student') {
            const uphslStudentEmailRegex = /^m\d{2}-\d{4}-\d{3}@manila\.uphsl\.edu\.ph$/;
            if (!uphslStudentEmailRegex.test(input.value)) {
                showValidationError(input, 'Student email must be in the format: mYY-XXXX-XXX@manila.uphsl.edu.ph');
                return false;
            }
            
            // Validate that the ID part matches the email format
            const idPart = input.value.split('@')[0];
            const studentIdField = document.querySelector('input[data-type="student-id"]');
            
            // If there's a student ID field and it has a value, check if they match
            if (studentIdField && studentIdField.value && studentIdField.value !== idPart) {
                showValidationError(input, 'Email does not match the provided student ID');
                return false;
            }
        }
        
        // UPHSL specific email validation for teachers
        if (input.dataset.emailType === 'teacher') {
            const uphslTeacherEmailRegex = /^[a-zA-Z\.]+@faculty\.uphsl\.edu\.ph$/;
            if (!uphslTeacherEmailRegex.test(input.value)) {
                showValidationError(input, 'Teacher email must be in the format: name@faculty.uphsl.edu.ph');
                return false;
            }
        }
        
        // UPHSL specific email validation for admin
        if (input.dataset.emailType === 'admin') {
            const uphslAdminEmailRegex = /^[a-zA-Z\.]+@admin\.uphsl\.edu\.ph$/;
            if (!uphslAdminEmailRegex.test(input.value)) {
                showValidationError(input, 'Admin email must be in the format: name@admin.uphsl.edu.ph');
                return false;
            }
        }
    }
    
    // Student ID validation - format: mYY-XXXX-XXX
    if (input.dataset.type === 'student-id' && input.value) {
        const studentIdRegex = /^m\d{2}-\d{4}-\d{3}$/;
        if (!studentIdRegex.test(input.value)) {
            showValidationError(input, 'Please enter a valid student ID (mYY-XXXX-XXX)');
            return false;
        }
        
        // Additional validation for the year part (YY)
        const year = input.value.substr(1, 2);
        const currentYear = new Date().getFullYear().toString().substr(2, 2);
        const tenYearsAgo = (new Date().getFullYear() - 10).toString().substr(2, 2);
        
        // Validate that the year is not in the future and not more than 10 years in the past
        if (parseInt(year) > parseInt(currentYear) || parseInt(year) < parseInt(tenYearsAgo)) {
            showValidationError(input, `Year part of ID (${year}) is invalid. Must be between ${tenYearsAgo} and ${currentYear}`);
            return false;
        }
    }
    
    // Teacher ID validation - format: tYYYY-XXXX
    if (input.dataset.type === 'teacher-id' && input.value) {
        const teacherIdRegex = /^t\d{4}-\d{4}$/;
        if (!teacherIdRegex.test(input.value)) {
            showValidationError(input, 'Please enter a valid teacher ID (tYYYY-XXXX)');
            return false;
        }
    }
    
    // Length validation (min and max)
    if (input.hasAttribute('minlength') && input.value) {
        const minLength = parseInt(input.getAttribute('minlength'));
        if (input.value.length < minLength) {
            showValidationError(input, `This field must be at least ${minLength} characters`);
            return false;
        }
    }
    
    if (input.hasAttribute('maxlength') && input.value) {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        if (input.value.length > maxLength) {
            showValidationError(input, `This field must be at most ${maxLength} characters`);
            return false;
        }
    }
    
    // Number range validation (min and max)
    if (input.type === 'number' && input.value) {
        if (input.hasAttribute('min')) {
            const min = parseFloat(input.getAttribute('min'));
            if (parseFloat(input.value) < min) {
                showValidationError(input, `This field must be at least ${min}`);
                return false;
            }
        }
        
        if (input.hasAttribute('max')) {
            const max = parseFloat(input.getAttribute('max'));
            if (parseFloat(input.value) > max) {
                showValidationError(input, `This field must be at most ${max}`);
                return false;
            }
        }
    }
    
    // Password validation
    if (input.type === 'password' && input.value) {
        // Skip simple password validation for password confirmation fields
        if (input.id && input.id.includes('confirm')) {
            // Find the original password field
            const passwordField = document.getElementById(input.id.replace('confirm', ''));
            if (passwordField && input.value !== passwordField.value) {
                showValidationError(input, 'Passwords do not match');
                return false;
            }
        } else {
            // Only validate complex requirements for the main password field
            const requirements = securityConfig.passwordRequirements;
            
            if (input.value.length < requirements.minLength) {
                showValidationError(input, `Password must be at least ${requirements.minLength} characters`);
                return false;
            }
            
            if (requirements.requireUppercase && !/[A-Z]/.test(input.value)) {
                showValidationError(input, 'Password must contain at least one uppercase letter');
                return false;
            }
            
            if (requirements.requireLowercase && !/[a-z]/.test(input.value)) {
                showValidationError(input, 'Password must contain at least one lowercase letter');
                return false;
            }
            
            if (requirements.requireNumbers && !/[0-9]/.test(input.value)) {
                showValidationError(input, 'Password must contain at least one number');
                return false;
            }
            
            if (requirements.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input.value)) {
                showValidationError(input, 'Password must contain at least one special character');
                return false;
            }
        }
    }
    
    // Custom validation for specific fields
    if (input.dataset.validate) {
        switch (input.dataset.validate) {
            case 'phone':
                const phoneRegex = /^\+?[0-9]{10,15}$/;
                if (!phoneRegex.test(input.value.replace(/[\s-]/g, ''))) {
                    showValidationError(input, 'Please enter a valid phone number');
                    return false;
                }
                break;
            
            case 'url':
                try {
                    new URL(input.value);
                } catch (e) {
                    showValidationError(input, 'Please enter a valid URL');
                    return false;
                }
                break;
            
            case 'date':
                const date = new Date(input.value);
                if (isNaN(date.getTime())) {
                    showValidationError(input, 'Please enter a valid date');
                    return false;
                }
                break;
        }
    }
    
    // If we reach here, the input is valid
    return true;
}

/**
 * Show a validation error for an input
 * @param {HTMLElement} input - The input with the error
 * @param {string} message - The error message
 */
function showValidationError(input, message) {
    // Mark the input as invalid
    input.classList.add('invalid');
    
    // Create or update the error message
    let errorElement = input.parentNode.querySelector('.validation-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * Remove validation error from an input
 * @param {HTMLElement} input - The input to remove error from
 */
function removeValidationError(input) {
    // Remove the invalid class
    input.classList.remove('invalid');
    
    // Remove the error message if it exists
    const errorElement = input.parentNode.querySelector('.validation-error');
    if (errorElement) {
    }
    
    // Additional validation for the year part (YY)
    const year = studentId.substr(1, 2);
    const currentYear = new Date().getFullYear().toString().substr(2, 2);
    const tenYearsAgo = (new Date().getFullYear() - 10).toString().substr(2, 2);
    
    // Validate that the year is not in the future and not more than 10 years in the past
    if (parseInt(year) > parseInt(currentYear) || parseInt(year) < parseInt(tenYearsAgo)) {
        return { 
            isValid: false, 
            message: `Year part of ID (${year}) is invalid. Must be between ${tenYearsAgo} and ${currentYear}` 
        };
    }
    
    return { isValid: true, message: 'Valid student ID' };
}

/**
 * Generate a student email from a student ID
 * @param {string} studentId - The student ID
 * @returns {string} - The corresponding student email
 */
function generateStudentEmail(studentId) {
    // Validate the student ID first
    const validation = validateStudentId(studentId);
    if (!validation.isValid) {
        return '';
    }
    
    // Generate the email
    return `${studentId}@manila.uphsl.edu.ph`;
}

/**
 * Validate a password and check its strength
 * @param {string} password - The password to validate
 * @returns {object} - Object with isValid, strength and message properties
 */
function validatePassword(password) {
    if (!password) {
        return { isValid: false, strength: 'very-weak', message: 'Password is required' };
    }
    
    const requirements = securityConfig.passwordRequirements;
    let strength = 0;
    let message = '';
    
    // Check length
    if (password.length < requirements.minLength) {
        message = `Password must be at least ${requirements.minLength} characters`;
    } else {
        strength += 1;
    }
    
    // Check for uppercase letters
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
        message = message || 'Password must contain at least one uppercase letter';
    } else {
        strength += 1;
    }
    
    // Check for lowercase letters
    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
        message = message || 'Password must contain at least one lowercase letter';
    } else {
        strength += 1;
    }
    
    // Check for numbers
    if (requirements.requireNumbers && !/[0-9]/.test(password)) {
        message = message || 'Password must contain at least one number';
    } else {
        strength += 1;
    }
    
    // Check for special characters
    if (requirements.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        message = message || 'Password must contain at least one special character';
    } else {
        strength += 1;
    }
    
    // Map strength score to category
    let strengthCategory = 'very-weak';
    if (strength === 5) strengthCategory = 'very-strong';
    else if (strength === 4) strengthCategory = 'strong';
    else if (strength === 3) strengthCategory = 'medium';
    else if (strength === 2) strengthCategory = 'weak';
    
    return {
        isValid: strength >= 3, // At least medium strength is required
        strength: strengthCategory,
        message: message || 'Valid password'
    };
}

// Export the security module
window.SecurityModule = {
    init: initSecurity,
    validateForm: validateForm,
    validateInput: validateInput,
    sanitizeInput: sanitizeInput,
    hasAccess: hasAccess,
    logoutUser: logoutUser,
    logAccess: logAccess,
    logSecurityEvent: logSecurityEvent,
    getCurrentPage: getCurrentPage,
    extendSession: extendSession,
    validateStudentId: validateStudentId,
    generateStudentEmail: generateStudentEmail,
    validatePassword: validatePassword
};
