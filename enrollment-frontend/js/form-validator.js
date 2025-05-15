/**
 * Form Validation Module
 * Provides centralized form validation functionality for the frontend
 */

class FormValidator {
  /**
   * Initialize the form validator
   * @param {HTMLFormElement} form - The form element to validate
   * @param {Object} options - Configuration options
   */
  constructor(form, options = {}) {
    this.form = form;
    this.options = {
      validateOnInput: true,
      validateOnBlur: true,
      showSuccessState: true,
      errorClass: 'error-field',
      successClass: 'success-field',
      errorMessageClass: 'validation-error',
      ...options
    };
    
    this.validators = {};
    this.customValidators = {};
    this.errors = {};
    
    // Initialize validation events
    this._initEvents();
  }
  
  /**
   * Initialize form events
   * @private
   */
  _initEvents() {
    // Validate on form submission
    this.form.addEventListener('submit', (event) => {
      if (!this.validateAll()) {
        event.preventDefault();
        this._focusFirstError();
      }
    });
    
    // Validate fields on blur if enabled
    if (this.options.validateOnBlur) {
      this.form.addEventListener('blur', (event) => {
        if (event.target.tagName === 'INPUT' || 
            event.target.tagName === 'SELECT' || 
            event.target.tagName === 'TEXTAREA') {
          this.validate(event.target);
        }
      }, true);
    }
    
    // Validate fields on input if enabled
    if (this.options.validateOnInput) {
      this.form.addEventListener('input', (event) => {
        if (event.target.tagName === 'INPUT' || 
            event.target.tagName === 'SELECT' || 
            event.target.tagName === 'TEXTAREA') {
          this.validate(event.target);
        }
      }, true);
    }
  }
  
  /**
   * Add a validation rule for a field
   * @param {string} fieldName - The name of the field
   * @param {Array} rules - Array of validation rules
   */
  addRules(fieldName, rules) {
    this.validators[fieldName] = rules;
  }
  
  /**
   * Add a custom validator function
   * @param {string} name - The name of the validator
   * @param {Function} fn - The validator function
   */
  addCustomValidator(name, fn) {
    this.customValidators[name] = fn;
  }
  
  /**
   * Validate a single field
   * @param {HTMLElement} field - The field to validate
   * @returns {boolean} Whether the field is valid
   */
  validate(field) {
    const fieldName = field.name;
    
    // Skip validation if no rules defined for this field
    if (!this.validators[fieldName]) {
      return true;
    }
    
    // Clear previous validation state
    this._clearValidationState(field);
    
    // Check each validation rule
    let isValid = true;
    let errorMessage = '';
    
    for (const rule of this.validators[fieldName]) {
      const result = this._checkRule(field, rule);
      
      if (!result.valid) {
        isValid = false;
        errorMessage = result.message;
        break;
      }
    }
    
    // Update validation state
    if (!isValid) {
      this._setErrorState(field, errorMessage);
      this.errors[fieldName] = errorMessage;
    } else {
      delete this.errors[fieldName];
      if (this.options.showSuccessState) {
        this._setSuccessState(field);
      }
    }
    
    return isValid;
  }
  
  /**
   * Validate all fields in the form
   * @returns {boolean} Whether all fields are valid
   */
  validateAll() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input, select, textarea');
    
    // Clear all errors
    this.errors = {};
    
    // Validate each field
    fields.forEach(field => {
      if (field.name && this.validators[field.name]) {
        if (!this.validate(field)) {
          isValid = false;
        }
      }
    });
    
    return isValid;
  }
  
  /**
   * Get all validation errors
   * @returns {Object} Object with field names as keys and error messages as values
   */
  getErrors() {
    return { ...this.errors };
  }
  
  /**
   * Check if a field passes a validation rule
   * @param {HTMLElement} field - The field to check
   * @param {Object} rule - The validation rule
   * @returns {Object} Object with valid flag and error message
   * @private
   */
  _checkRule(field, rule) {
    const value = field.value.trim();
    
    // Required validation
    if (rule.type === 'required' && !value) {
      return {
        valid: false,
        message: rule.message || 'This field is required'
      };
    }
    
    // Skip other validations if field is empty and not required
    if (!value && rule.type !== 'required') {
      return { valid: true };
    }
    
    // Email validation
    if (rule.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          valid: false,
          message: rule.message || 'Please enter a valid email address'
        };
      }
    }
    
    // Min length validation
    if (rule.type === 'minLength' && value.length < rule.value) {
      return {
        valid: false,
        message: rule.message || `Please enter at least ${rule.value} characters`
      };
    }
    
    // Max length validation
    if (rule.type === 'maxLength' && value.length > rule.value) {
      return {
        valid: false,
        message: rule.message || `Please enter no more than ${rule.value} characters`
      };
    }
    
    // Pattern validation
    if (rule.type === 'pattern' && !rule.pattern.test(value)) {
      return {
        valid: false,
        message: rule.message || 'Please match the requested format'
      };
    }
    
    // Number validation
    if (rule.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return {
          valid: false,
          message: rule.message || 'Please enter a valid number'
        };
      }
      
      if (rule.min !== undefined && num < rule.min) {
        return {
          valid: false,
          message: rule.message || `Please enter a number greater than or equal to ${rule.min}`
        };
      }
      
      if (rule.max !== undefined && num > rule.max) {
        return {
          valid: false,
          message: rule.message || `Please enter a number less than or equal to ${rule.max}`
        };
      }
    }
    
    // Match validation (e.g., password confirmation)
    if (rule.type === 'match') {
      const matchField = this.form.querySelector(`[name="${rule.field}"]`);
      if (matchField && value !== matchField.value) {
        return {
          valid: false,
          message: rule.message || `This field must match ${rule.field}`
        };
      }
    }
    
    // Student ID validation for our specific format
    if (rule.type === 'studentId') {
      const pattern = /^m[0-9]{2}-[0-9]{4}-[0-9]{3}$/;
      if (!pattern.test(value)) {
        return {
          valid: false,
          message: rule.message || 'Student ID must follow the format: mYY-XXXX-XXX (e.g., m23-1470-578)'
        };
      }
    }
    
    // Custom validation
    if (rule.type === 'custom' && this.customValidators[rule.validator]) {
      const customResult = this.customValidators[rule.validator](value, field, this.form);
      if (!customResult.valid) {
        return {
          valid: false,
          message: customResult.message || rule.message || 'Invalid input'
        };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Clear validation state for a field
   * @param {HTMLElement} field - The field to clear validation state for
   * @private
   */
  _clearValidationState(field) {
    // Remove error/success classes
    field.classList.remove(this.options.errorClass, this.options.successClass);
    
    // Remove error message
    const parent = field.parentElement;
    const errorElement = parent.querySelector(`.${this.options.errorMessageClass}`);
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  /**
   * Set error state for a field
   * @param {HTMLElement} field - The field to set error state for
   * @param {string} message - The error message
   * @private
   */
  _setErrorState(field, message) {
    // Add error class
    field.classList.add(this.options.errorClass);
    
    // Add error message
    const errorElement = document.createElement('span');
    errorElement.className = this.options.errorMessageClass;
    errorElement.textContent = message;
    
    // Add after the field
    const parent = field.parentElement;
    parent.appendChild(errorElement);
  }
  
  /**
   * Set success state for a field
   * @param {HTMLElement} field - The field to set success state for
   * @private
   */
  _setSuccessState(field) {
    field.classList.add(this.options.successClass);
  }
  
  /**
   * Focus the first field with an error
   * @private
   */
  _focusFirstError() {
    for (const fieldName in this.errors) {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.focus();
        break;
      }
    }
  }
  
  /**
   * Reset the form and clear all validation states
   */
  reset() {
    this.errors = {};
    
    const fields = this.form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      this._clearValidationState(field);
    });
    
    this.form.reset();
  }
}

// Common validation rules
const ValidationRules = {
  required: (message) => ({ type: 'required', message }),
  email: (message) => ({ type: 'email', message }),
  minLength: (min, message) => ({ type: 'minLength', value: min, message }),
  maxLength: (max, message) => ({ type: 'maxLength', value: max, message }),
  pattern: (pattern, message) => ({ type: 'pattern', pattern, message }),
  number: (options, message) => ({ type: 'number', ...options, message }),
  match: (field, message) => ({ type: 'match', field, message }),
  studentId: (message) => ({ type: 'studentId', message }),
  custom: (validator, message) => ({ type: 'custom', validator, message })
};

// Predefined password strength validator
const passwordStrengthValidator = (value) => {
  const hasLowerCase = /[a-z]/.test(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isLongEnough = value.length >= 8;
  
  if (!isLongEnough) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Calculate strength
  let strength = 0;
  if (hasLowerCase) strength++;
  if (hasUpperCase) strength++;
  if (hasNumber) strength++;
  if (hasSpecial) strength++;
  
  if (strength < 3) {
    return {
      valid: false,
      message: 'Password must include at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters'
    };
  }
  
  return { valid: true };
};

// Example usage:
/*
const form = document.getElementById('registration-form');
const validator = new FormValidator(form);

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

validator.addCustomValidator('passwordStrength', passwordStrengthValidator);
*/

// Expose globally
window.FormValidator = FormValidator;
window.ValidationRules = ValidationRules;
window.passwordStrengthValidator = passwordStrengthValidator;
