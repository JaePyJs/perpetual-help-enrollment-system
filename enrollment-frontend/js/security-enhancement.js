/**
 * Advanced Security Enhancements for School Enrollment System
 * This module provides XSS protection, CSRF protection, content security policies,
 * and other advanced security features.
 */

// Security enhancement configuration
const securityEnhancementConfig = {
    csrfTokenName: 'X-CSRF-TOKEN',
    csrfTokenExpiry: 60, // minutes
    contentSecurityPolicy: true,
    xssProtection: true,
    sanitizeHtml: true
};

// Initialize the security enhancements
function initSecurityEnhancements() {
    // Initialize CSRF protection
    initCsrfProtection();
    
    // Initialize XSS protection
    initXssProtection();
    
    // Initialize content security policy
    if (securityEnhancementConfig.contentSecurityPolicy) {
        initContentSecurityPolicy();
    }
    
    // Add security headers to API requests
    addSecurityHeaders();
    
    console.log("Security enhancements initialized");
}

// ===== CSRF PROTECTION =====

/**
 * Initialize CSRF protection by generating a token and adding it to all forms and AJAX requests
 */
function initCsrfProtection() {
    // Generate a CSRF token if one doesn't exist or has expired
    const token = generateCsrfToken();
    
    // Add the token to all forms
    addCsrfTokenToForms(token);
    
    // Set up AJAX request interception to add the token
    setupAjaxCsrfProtection(token);
}

/**
 * Generate a CSRF token and store it in localStorage
 * @returns {string} The CSRF token
 */
function generateCsrfToken() {
    const tokenData = localStorage.getItem('csrfToken');
    let token = null;
    
    if (tokenData) {
        try {
            const data = JSON.parse(tokenData);
            
            // Check if the token has expired
            const expiresAt = new Date(data.expiresAt);
            const now = new Date();
            
            if (expiresAt > now) {
                token = data.token;
            }
        } catch (error) {
            console.error('Error parsing CSRF token:', error);
        }
    }
    
    // If no valid token exists, generate a new one
    if (!token) {
        token = generateRandomToken(64);
        
        // Calculate expiry time
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + securityEnhancementConfig.csrfTokenExpiry);
        
        // Store the token
        localStorage.setItem('csrfToken', JSON.stringify({
            token: token,
            expiresAt: expiresAt.toISOString()
        }));
    }
    
    return token;
}

/**
 * Generate a random token of a specified length
 * @param {number} length - The length of the token
 * @returns {string} The random token
 */
function generateRandomToken(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return token;
}

/**
 * Add the CSRF token to all forms in the document
 * @param {string} token - The CSRF token
 */
function addCsrfTokenToForms(token) {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip forms with the 'no-csrf' class
        if (form.classList.contains('no-csrf')) return;
        
        // Check if the form already has a CSRF token input
        let tokenInput = form.querySelector(`input[name="${securityEnhancementConfig.csrfTokenName}"]`);
        
        if (!tokenInput) {
            // Create a new hidden input for the token
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = securityEnhancementConfig.csrfTokenName;
            form.appendChild(tokenInput);
        }
        
        // Set the token value
        tokenInput.value = token;
    });
}

/**
 * Set up AJAX request interception to add the CSRF token to all requests
 * @param {string} token - The CSRF token
 */
function setupAjaxCsrfProtection(token) {
    // Only proceed if fetch exists
    if (typeof fetch === 'function') {
        // Store the original fetch function
        const originalFetch = window.fetch;
        
        // Replace with our interceptor
        window.fetch = function(resource, options = {}) {
            // Clone the options to avoid modifying the original
            const newOptions = {...options};
            
            // Ensure headers exist
            newOptions.headers = newOptions.headers || {};
            
            // If headers is an object, add the CSRF token
            if (typeof newOptions.headers === 'object' && !(newOptions.headers instanceof Headers)) {
                newOptions.headers[securityEnhancementConfig.csrfTokenName] = token;
            } 
            // If headers is a Headers object, append the CSRF token
            else if (newOptions.headers instanceof Headers) {
                newOptions.headers.append(securityEnhancementConfig.csrfTokenName, token);
            }
            
            // Call the original fetch with the modified options
            return originalFetch.call(this, resource, newOptions);
        };
    }
    
    // Handle XMLHttpRequest for older browsers
    if (typeof XMLHttpRequest !== 'undefined') {
        // Store the original open method
        const originalOpen = XMLHttpRequest.prototype.open;
        
        // Replace with our interceptor
        XMLHttpRequest.prototype.open = function() {
            // Call the original open method
            originalOpen.apply(this, arguments);
            
            // Add an event listener for when the request is about to be sent
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 1) { // OPENED
                    this.setRequestHeader(securityEnhancementConfig.csrfTokenName, token);
                }
            });
        };
    }
}

// ===== XSS PROTECTION =====

/**
 * Initialize XSS protection for input fields and dynamic content
 */
function initXssProtection() {
    // Set up input sanitization
    setupInputSanitization();
    
    // Set up output escaping
    setupOutputEscaping();
    
    // Observe DOM mutations to sanitize dynamically added content
    if (securityEnhancementConfig.sanitizeHtml) {
        observeDomMutations();
    }
}

/**
 * Set up sanitization for input fields to prevent XSS
 */
function setupInputSanitization() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Skip inputs with the 'no-sanitize' class
        if (input.classList.contains('no-sanitize')) return;
        
        // Remove existing event listeners
        input.removeEventListener('input', sanitizeInputHandler);
        
        // Add new event listener
        input.addEventListener('input', sanitizeInputHandler);
    });
}

/**
 * Handler for sanitizing input values
 * @param {Event} event - The input event
 */
function sanitizeInputHandler(event) {
    const input = event.target;
    const originalValue = input.value;
    
    // Don't sanitize password fields
    if (input.type === 'password') return;
    
    // Sanitize the input value
    const sanitizedValue = sanitizeHtml(originalValue);
    
    // Only update if the value has changed
    if (sanitizedValue !== originalValue) {
        input.value = sanitizedValue;
    }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - The HTML string to sanitize
 * @returns {string} The sanitized HTML
 */
function sanitizeHtml(html) {
    if (typeof html !== 'string') return html;
    
    // Create a temporary element
    const temp = document.createElement('div');
    
    // Set the HTML content (this will encode entities)
    temp.textContent = html;
    
    // Return the sanitized content
    return temp.innerHTML;
}

/**
 * Set up output escaping for dynamic content
 */
function setupOutputEscaping() {
    // Override innerHTML to enforce escaping
    overrideInnerHTML();
    
    // Helper function to override the innerHTML property
    function overrideInnerHTML() {
        // Store original innerHTML setter
        const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
        
        // Override innerHTML
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                // Skip elements with the 'no-sanitize' class
                if (this.classList && this.classList.contains('no-sanitize')) {
                    originalInnerHTMLSetter.call(this, value);
                    return;
                }
                
                // For normal elements, sanitize the content
                if (securityEnhancementConfig.sanitizeHtml) {
                    value = sanitizeHtmlContent(value);
                }
                
                // Call the original setter
                originalInnerHTMLSetter.call(this, value);
            },
            configurable: true
        });
    }
}

/**
 * Sanitize HTML content to remove potentially dangerous tags and attributes
 * @param {string} html - The HTML content to sanitize
 * @returns {string} The sanitized HTML
 */
function sanitizeHtmlContent(html) {
    if (typeof html !== 'string') return html;
    
    // Regular expressions for potentially dangerous patterns
    const dangerousTagsRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const dangerousEventsRegex = /on\w+\s*=\s*["']?[^"']*["']?/gi;
    const dangerousUrlsRegex = /href\s*=\s*["']?javascript:[^"']*["']?/gi;
    
    // Remove dangerous tags and attributes
    let sanitized = html
        .replace(dangerousTagsRegex, '')
        .replace(dangerousEventsRegex, '')
        .replace(dangerousUrlsRegex, '');
    
    return sanitized;
}

/**
 * Observe DOM mutations to sanitize dynamically added content
 */
function observeDomMutations() {
    // Only proceed if MutationObserver exists
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Only handle added nodes
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // Only process element nodes
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Skip elements with the 'no-sanitize' class
                            if (node.classList && node.classList.contains('no-sanitize')) {
                                return;
                            }
                            
                            // Sanitize the node content
                            sanitizeNode(node);
                        }
                    });
                }
            });
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
}

/**
 * Sanitize a DOM node and its children
 * @param {Node} node - The node to sanitize
 */
function sanitizeNode(node) {
    // Skip text nodes and non-element nodes
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    // Check if this is a script element
    if (node.tagName.toLowerCase() === 'script') {
        node.parentNode.removeChild(node);
        return;
    }
    
    // Remove dangerous event handlers
    for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        
        // Remove on* event handlers
        if (attr.name.startsWith('on')) {
            node.removeAttribute(attr.name);
            i--; // Adjust for the removed attribute
        }
        
        // Remove javascript: URLs
        if (attr.name === 'href' && attr.value.toLowerCase().startsWith('javascript:')) {
            node.removeAttribute(attr.name);
            i--; // Adjust for the removed attribute
        }
    }
    
    // Recursively sanitize child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
        sanitizeNode(node.childNodes[i]);
    }
}

// ===== CONTENT SECURITY POLICY =====

/**
 * Initialize the Content Security Policy for the application
 */
function initContentSecurityPolicy() {
    // Create a meta tag for CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    
    // Define the CSP directives
    cspMeta.content = 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://ajax.googleapis.com; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.example.com; " +
        "form-action 'self'; " +
        "frame-ancestors 'self'";
    
    // Add the meta tag to the head
    document.head.appendChild(cspMeta);
}

// ===== API SECURITY HEADERS =====

/**
 * Add security headers to all outgoing API requests
 */
function addSecurityHeaders() {
    // Only proceed if fetch exists
    if (typeof fetch === 'function') {
        // Store the original fetch function
        const originalFetch = window.fetch;
        
        // Replace with our interceptor
        window.fetch = function(resource, options = {}) {
            // Clone the options to avoid modifying the original
            const newOptions = {...options};
            
            // Ensure headers exist
            newOptions.headers = newOptions.headers || {};
            
            // Add security headers
            if (typeof newOptions.headers === 'object' && !(newOptions.headers instanceof Headers)) {
                newOptions.headers['X-Content-Type-Options'] = 'nosniff';
                newOptions.headers['X-Frame-Options'] = 'DENY';
                newOptions.headers['X-XSS-Protection'] = '1; mode=block';
            } 
            // If headers is a Headers object, append the security headers
            else if (newOptions.headers instanceof Headers) {
                newOptions.headers.append('X-Content-Type-Options', 'nosniff');
                newOptions.headers.append('X-Frame-Options', 'DENY');
                newOptions.headers.append('X-XSS-Protection', '1; mode=block');
            }
            
            // Call the original fetch with the modified options
            return originalFetch.call(this, resource, newOptions);
        };
    }
}

// ===== SECURITY AUDIT LOGGING =====

/**
 * Log a security-related event
 * @param {string} eventType - The type of security event
 * @param {object} details - Details about the event
 * @param {boolean} isViolation - Whether this is a security violation
 */
function logSecurityEvent(eventType, details = {}, isViolation = false) {
    // Get current user information
    const userInfo = window.SessionManager ? window.SessionManager.getCurrentUser() : null;
    
    // Create the event data
    const eventData = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        userInfo: userInfo,
        details: details,
        isViolation: isViolation,
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Log to console
    console.log(`[SECURITY EVENT] ${eventType}`, eventData);
    
    // In a real implementation, we would send this to the server
    if (typeof fetch === 'function' && eventData.isViolation) {
        /*
        fetch('/api/security/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.error('Error logging security event:', error);
        });
        */
    }
    
    // Store in local storage for audit purposes (temporary, in a real system we'd send to server)
    try {
        const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        securityLogs.push(eventData);
        
        // Keep only the last 100 logs to avoid excessive storage use
        if (securityLogs.length > 100) {
            securityLogs.shift();
        }
        
        localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
    } catch (error) {
        console.error('Error storing security log:', error);
    }
}

// ===== VULNERABILITY SCANNING =====

/**
 * Scan the DOM for common security vulnerabilities
 * @returns {Array} Array of detected vulnerabilities
 */
function scanForVulnerabilities() {
    const vulnerabilities = [];
    
    // Check for password fields in non-HTTPS
    if (location.protocol !== 'https:') {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        if (passwordFields.length > 0) {
            vulnerabilities.push({
                type: 'passwordOverHttp',
                severity: 'high',
                description: 'Password field detected on non-HTTPS page',
                elements: Array.from(passwordFields).map(el => el.id || el.name || 'unnamed')
            });
            
            logSecurityEvent('passwordOverHttp', {
                elements: Array.from(passwordFields).map(el => el.id || el.name || 'unnamed')
            }, true);
        }
    }
    
    // Check for forms without CSRF protection
    const forms = document.querySelectorAll('form:not(.no-csrf)');
    forms.forEach(form => {
        const csrfToken = form.querySelector(`input[name="${securityEnhancementConfig.csrfTokenName}"]`);
        if (!csrfToken) {
            vulnerabilities.push({
                type: 'missingCsrfToken',
                severity: 'medium',
                description: 'Form without CSRF token protection',
                element: form.id || form.action || 'unnamed form'
            });
            
            logSecurityEvent('missingCsrfToken', {
                element: form.id || form.action || 'unnamed form'
            }, true);
            
            // Automatically add the token
            addCsrfTokenToForms(generateCsrfToken());
        }
    });
    
    // Check for inline scripts (CSP violation)
    const inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 0 && securityEnhancementConfig.contentSecurityPolicy) {
        vulnerabilities.push({
            type: 'inlineScript',
            severity: 'medium',
            description: 'Inline scripts detected, potential CSP violation',
            count: inlineScripts.length
        });
        
        logSecurityEvent('inlineScript', {
            count: inlineScripts.length
        }, false);
    }
    
    return vulnerabilities;
}

// ===== EXPORTS =====

// Export the security enhancements module
window.SecurityEnhancement = {
    init: initSecurityEnhancements,
    scanForVulnerabilities: scanForVulnerabilities,
    logSecurityEvent: logSecurityEvent,
    sanitizeHtml: sanitizeHtml,
    sanitizeHtmlContent: sanitizeHtmlContent,
    generateCsrfToken: generateCsrfToken
};

// Run security enhancements on load
document.addEventListener('DOMContentLoaded', function() {
    initSecurityEnhancements();
    
    // Scan for vulnerabilities on load
    setTimeout(() => {
        const vulnerabilities = scanForVulnerabilities();
        if (vulnerabilities.length > 0) {
            console.warn('Security vulnerabilities detected:', vulnerabilities);
        }
    }, 1000);
});
