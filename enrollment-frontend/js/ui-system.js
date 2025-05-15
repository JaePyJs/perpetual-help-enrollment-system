/**
 * UI System JavaScript for Perpetual Help College of Manila
 * Provides common functionality across all pages
 */

// Theme Management
function getThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check for system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // Default to light theme
  return 'light';
}

function applyTheme(theme) {
  const htmlElement = document.documentElement;
  
  // Remove any existing theme classes
  htmlElement.classList.remove('light', 'dark');
  
  // Reset active states on theme buttons if they exist
  document.querySelectorAll('.theme-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (theme === 'dark') {
    htmlElement.classList.add('dark');
    const darkBtn = document.getElementById('dark-theme-btn');
    if (darkBtn) darkBtn.classList.add('active');
  } else if (theme === 'light') {
    htmlElement.classList.add('light');
    const lightBtn = document.getElementById('light-theme-btn');
    if (lightBtn) lightBtn.classList.add('active');
  } else if (theme === 'system') {
    // Use system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.add('light');
    }
    const systemBtn = document.getElementById('system-theme-btn');
    if (systemBtn) systemBtn.classList.add('active');
  }
}

function changeTheme(theme) {
  applyTheme(theme);
  localStorage.setItem('theme', theme);
}

// Show/Hide Sections
function showSection(sectionId, containerSelector = '.dashboard-section') {
  // Hide all sections first
  document.querySelectorAll(containerSelector).forEach(section => {
    section.classList.remove('active', 'section-visible');
    section.classList.add('section-hidden');
  });
  
  // Show the selected section
  const targetSection = document.getElementById(sectionId + '-section');
  if (targetSection) {
    targetSection.classList.add('active', 'section-visible');
    targetSection.classList.remove('section-hidden');
  }
  
  // Update active state in sidebar navigation
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Find the matching link and add active class
  const targetLink = document.querySelector(`.sidebar a[data-section="${sectionId}"]`);
  if (targetLink) {
    targetLink.classList.add('active');
  }
}

// Password Visibility Toggle
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.querySelector(`[data-password-toggle="${inputId}"] i`);
  
  if (input && icon) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

// Form Validation Helpers
function showFormError(formId, message) {
  const errorElement = document.getElementById(`${formId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

function clearFormError(formId) {
  const errorElement = document.getElementById(`${formId}-error`);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Initialization on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply theme from saved preference
  const savedTheme = getThemePreference();
  applyTheme(savedTheme);
  
  // Listen for system preference changes if using system theme
  if (window.matchMedia && savedTheme === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      applyTheme('system');
    });
  }
  
  // Initialize theme buttons
  const themeButtons = document.querySelectorAll('[data-theme]');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      changeTheme(theme);
    });
  });
  
  // Initialize sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-section]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      showSection(section);
    });
  });
  
  // Initialize password toggles
  const passwordToggles = document.querySelectorAll('[data-password-toggle]');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const inputId = toggle.getAttribute('data-password-toggle');
      togglePasswordVisibility(inputId);
    });
  });
});
