// Role indicator functionality
function updateRoleIndicator(role) {
  const indicator =
    document.querySelector(".role-indicator") || document.createElement("div");
  indicator.className = `role-indicator ${role}`;
  indicator.textContent = `${
    role.charAt(0).toUpperCase() + role.slice(1)
  } Login`;

  if (!document.body.contains(indicator)) {
    document.querySelector(".right-panel").appendChild(indicator);
  }

  // Force reflow to trigger animation
  void indicator.offsetWidth;
  indicator.classList.add("visible");
}

// Tab switching functionality with animations
function openTab(tabId) {
  const tabContents = document.querySelectorAll(".tab-content");
  const tabLinks = document.querySelectorAll(".tab-link");
  const roleImages = document.querySelectorAll(".role-image");
  const currentTab = document.querySelector(".tab-content.active");

  // Remove active state from all tabs and images first
  tabLinks.forEach((link) => link.classList.remove("active"));
  roleImages.forEach((img) => img.classList.remove("active"));

  // Update role indicator
  updateRoleIndicator(tabId);

  // First, animate out the current content
  if (currentTab) {
    currentTab.style.opacity = "0";
    currentTab.style.transform = "translateY(10px)";
  }

  // After fade out, switch content
  setTimeout(() => {
    tabContents.forEach((content) => {
      content.style.display = "none";
      content.classList.remove("active");
    });

    // Show and activate the selected tab
    const selectedTab = document.getElementById(tabId);
    selectedTab.style.display = "flex";
    selectedTab.classList.add("active");

    // Activate the corresponding button and image
    document
      .querySelector(`button[onclick*="${tabId}"]`)
      .classList.add("active");
    document.getElementById(`img-${tabId}`).classList.add("active");

    // Update image container background based on role
    const imageContainer = document.querySelector(".image-container");
    imageContainer.className = `image-container ${tabId}-theme`;

    // Trigger fade in animation
    requestAnimationFrame(() => {
      selectedTab.style.opacity = "1";
      selectedTab.style.transform = "translateY(0)";
    });
  }, 300);
}

// Password visibility toggle
function togglePassword(elem) {
  const container = elem.closest(".tab-content");
  const passwordInput = container.querySelector(".password-input");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    elem.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    elem.textContent = "Show";
  }
}

// Login handler
async function handleLogin(role) {
  const container = document.querySelector(`#${role}`);
  const button = container.querySelector(".continue");
  const username = container.querySelector('input[type="text"]').value.trim();
  const password = container.querySelector('input[type="password"]').value;
  const errorMessage = document.getElementById("error-message");

  // Input validation
  if (!username || !password) {
    errorMessage.textContent = "Please enter both username and password";
    errorMessage.style.display = "block";
    container.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => (container.style.animation = ""), 500);
    return;
  }

  // Reset error message
  errorMessage.style.display = "none";

  // Add loading state
  button.style.transition = "all 0.3s ease";
  button.disabled = true;
  button.style.backgroundColor = "#ccc";
  button.textContent = "Logging in...";
  button.style.cursor = "wait";

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      switch (data.user.role) {
        case "student":
          window.location.href = "student-dashboard.html";
          break;
        case "teacher":
          window.location.href = "teacher-dashboard.html";
          break;
        case "admin":
          window.location.href = "admin-dashboard.html";
          break;
      }
    } else {
      errorMessage.textContent = data.message;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent = "Connection error. Please try again.";
    errorMessage.style.display = "block";

    // Show error animation
    container.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => (container.style.animation = ""), 500);
  } finally {
    // Reset button state
    button.disabled = false;
    button.style.backgroundColor = "#e77f33";
    button.textContent = "Continue";
    button.style.cursor = "pointer";
  }
}

// Check if server is available
async function checkServerConnection() {
  try {
    const response = await fetch("http://localhost:3000/api/health", {
      method: "HEAD",
      cache: "no-cache",
    });
    if (!response.ok) {
      showError("Server is currently unavailable. Please try again later.");
    }
  } catch (error) {
    showError("Cannot connect to server. Please check your connection.");
  }
}

// Show error message with animation
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  errorMessage.classList.add("visible");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message with animation
function hideError() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.classList.remove("visible");
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 300);
}

// Debounce function to limit rate of server requests
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize with student tab
// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .tab-content {
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .tab-content.active {
    opacity: 1;
    transform: translateY(0);
  }

  .tab-link {
    transition: all 0.3s ease;
  }

  .tab-link:hover {
    color: #e77f33 !important;
  }

  .role-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(231, 127, 51, 0.9);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  .role-indicator.visible {
    opacity: 1;
  }

  .image-container {
    transition: background-color 0.3s ease;
  }

  .student-theme {
    background-color: #f0f8ff;
  }

  .teacher-theme {
    background-color: #fff4e6;
  }

  .admin-theme {
    background-color: #f9f9f9;
  }
`;
document.head.appendChild(style);

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const role = e.target.closest(".tab-content").id;
  handleLogin(role);
}

// Initialize the login page
function initializePage() {
  // Show initial tab
  openTab("student");

  // Set up form submissions
  document.querySelectorAll("form.tab-content").forEach((form) => {
    // Remove any existing listeners
    form.removeEventListener("submit", handleFormSubmit);
    // Add new submit listener
    form.addEventListener("submit", handleFormSubmit);
  });

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Alt + Arrow keys for navigation
    if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      const tabs = ["student", "teacher", "admin"];
      const currentTab = document.querySelector(".tab-content.active").id;
      const currentIndex = tabs.indexOf(currentTab);
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length;
      openTab(tabs[nextIndex]);
    }
  });

  // Improve focus management
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", () => {
      const form = input.closest("form");
      if (!form.classList.contains("active")) {
        openTab(form.id);
      }
    });
  });

  // Add loading indicator for server connection
  checkServerConnection();
}

document.addEventListener("DOMContentLoaded", initializePage);

// Handle disabled JavaScript gracefully
document.body.classList.remove("no-js");
document.body.classList.add("js-enabled");
