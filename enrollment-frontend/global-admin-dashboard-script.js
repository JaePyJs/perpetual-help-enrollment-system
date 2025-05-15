// Function to show selected content section
function showContent(contentId) {
  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(function(section) {
    section.style.display = 'none';
  });
  
  // Remove active class from all nav links
  document.querySelectorAll('.sidebar a').forEach(function(link) {
    link.classList.remove('active');
  });
  
  // Show selected content section
  document.getElementById(contentId + '-content').style.display = 'block';
  
  // Add active class to selected nav link
  document.querySelector('.sidebar a[onclick="showContent(\'' + contentId + '\')').classList.add('active');
  
  // Hide all admin panels when switching content
  hideAdminPanels();
}

// Theme toggle functionality
document.getElementById('theme-light').addEventListener('click', function() {
  changeTheme('light');
});

document.getElementById('theme-dark').addEventListener('click', function() {
  changeTheme('dark');
});

document.getElementById('theme-system').addEventListener('click', function() {
  changeTheme('system');
});

// Modern theme toggling with visual feedback
let previousTheme = localStorage.getItem('theme') || 'light';
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function changeTheme(theme) {
  // Skip transition if no visual change would occur
  if (previousTheme === 'dark' && theme === 'system' && systemPrefersDark) {
    // Just update the active button without transition
    updateActiveThemeButton(theme);
    localStorage.setItem('theme', theme);
    previousTheme = theme;
    return;
  }
  
  if (previousTheme === 'system' && theme === 'dark' && systemPrefersDark) {
    // Just update the active button without transition
    updateActiveThemeButton(theme);
    localStorage.setItem('theme', theme);
    previousTheme = theme;
    return;
  }
  
  // Proceed with transition
  document.body.classList.add('theme-transition');
  
  setTimeout(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'system') {
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    localStorage.setItem('theme', theme);
    updateActiveThemeButton(theme);
    previousTheme = theme;
    
    // Remove transition class after a delay
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }, 50);
}

function updateActiveThemeButton(activeTheme) {
  // Update top theme buttons
  document.querySelectorAll('.theme-button').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeTheme === 'light') {
    document.getElementById('theme-light').classList.add('active');
  } else if (activeTheme === 'dark') {
    document.getElementById('theme-dark').classList.add('active');
  } else if (activeTheme === 'system') {
    document.getElementById('theme-system').classList.add('active');
  }
  
  // Update sidebar theme buttons
  document.querySelectorAll('.theme-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeTheme === 'light') {
    document.getElementById('light-btn').classList.add('active');
  } else if (activeTheme === 'dark') {
    document.getElementById('dark-btn').classList.add('active');
  } else if (activeTheme === 'system') {
    document.getElementById('system-btn').classList.add('active');
  }
}

// Apply theme on page load
function applyTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (!theme) {
    // System preference
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', 'system');
  }
  
  // Set initial active button state
  updateActiveThemeButton(theme || 'system');
}

// Apply theme on page load
applyTheme();

// Listen for system theme changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme();
    }
  });
}

// Admin Management Functions
function showAdminPanel(panelId) {
  // Hide all admin panels first
  hideAdminPanels();
  
  // Show the selected panel
  const panel = document.getElementById(panelId + '-panel');
  if (panel) {
    panel.style.display = 'block';
  }
}

function hideAdminPanels() {
  // Hide all admin panels
  document.querySelectorAll('.admin-panel').forEach(function(panel) {
    panel.style.display = 'none';
  });
}

// Add new administrator
function addAdmin(event) {
  event.preventDefault();
  alert('Administrator added successfully!');
  hideAdminPanels();
  // In a real application, this would submit the form data to the server
}

// Confirm admin removal
function confirmAdminRemoval(username) {
  if (confirm(`Are you sure you want to remove administrator ${username}? This action cannot be undone.`)) {
    alert(`Administrator ${username} has been removed.`);
    // In a real application, this would send a request to the server to remove the admin
  }
}

// Logout function
function logout() {
  // In a real application, this would handle proper logout
  localStorage.removeItem('adminToken');
}
