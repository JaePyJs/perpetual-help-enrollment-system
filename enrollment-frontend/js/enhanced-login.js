// Show error message with animation
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  requestAnimationFrame(() => {
    errorMessage.classList.add("visible");
  });
}

// Hide error message with animation
function hideError() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.classList.remove("visible");
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 300);
}

// Enhanced tab switching with animations
function switchToTab(tabId) {
  const tabContents = document.querySelectorAll(".tab-content");
  const tabLinks = document.querySelectorAll(".tab-link");
  const roleImages = document.querySelectorAll(".role-image");

  // Hide error message when switching tabs
  hideError();

  // Fade out current content
  const currentTab = document.querySelector(".tab-content.active");
  if (currentTab) {
    currentTab.style.opacity = "0";
    currentTab.style.transform = "translateY(10px)";
  }

  // Switch content after fade out
  setTimeout(() => {
    // Hide all tabs and remove active states
    tabContents.forEach((content) => {
      content.style.display = "none";
      content.classList.remove("active");
    });
    tabLinks.forEach((link) => link.classList.remove("active"));
    roleImages.forEach((img) => img.classList.remove("active"));

    // Show and animate new content
    const selectedTab = document.getElementById(tabId);
    selectedTab.style.display = "flex";
    selectedTab.classList.add("active");

    // Set active states for tab and image
    document
      .querySelector(`button[onclick*="${tabId}"]`)
      .classList.add("active");
    document.getElementById(`img-${tabId}`).classList.add("active");

    // Clear form fields
    const form = document.getElementById(tabId);
    form.reset();

    // Trigger fade in
    requestAnimationFrame(() => {
      selectedTab.style.opacity = "1";
      selectedTab.style.transform = "translateY(0)";
    });
  }, 300);
}

// Enhanced password toggle with animation
function togglePassword(elem) {
  const container = elem.closest(".tab-content");
  const passwordInput = container.querySelector(".password-input");

  elem.style.transition = "all 0.3s ease";

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    elem.textContent = "Hide";
    elem.style.color = "#ff6b6b";
  } else {
    passwordInput.type = "password";
    elem.textContent = "Show";
    elem.style.color = "#e77f33";
  }
}

// Enhanced login handler with animations and feedback
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const role = form.id;
  const button = form.querySelector(".continue");
  const username = form.querySelector('input[type="text"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;

  // Input validation
  if (!username || !password) {
    showError("Please enter both username and password");
    form.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => (form.style.animation = ""), 500);
    return;
  }

  // Hide any previous error
  hideError();

  // Add loading state
  button.disabled = true;
  button.style.transition = "all 0.3s ease";
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

      // Success animation
      button.style.backgroundColor = "#4CAF50";
      button.textContent = "Success!";

      // Add success ripple effect
      const ripple = document.createElement("div");
      ripple.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: 200%;
                height: 200%;
                background: rgba(255,255,255,0.7);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
            `;
      button.style.overflow = "hidden";
      button.appendChild(ripple);

      // Redirect after success animation
      setTimeout(() => {
        const redirects = {
          student: "student-dashboard.html",
          teacher: "teacher-dashboard.html",
          admin: "admin-dashboard.html",
        };

        const redirectUrl = redirects[data.user.role];
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          showError("Invalid user role");
        }
      }, 800);
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError(error.message || "Connection error. Please try again.");

    // Error animation
    form.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      form.style.animation = "";
    }, 500);
  } finally {
    // Reset button state
    button.disabled = false;
    button.style.backgroundColor = "#e77f33";
    button.textContent = "Continue";
    button.style.cursor = "pointer";

    // Remove ripple effect if it exists
    const ripple = button.querySelector("div");
    if (ripple) {
      ripple.remove();
    }
  }
}

// Initialize interactivity
document.addEventListener("DOMContentLoaded", () => {
  // Show initial tab
  switchToTab("student");

  // Set up form submissions
  document.querySelectorAll("form.tab-content").forEach((form) => {
    form.addEventListener("submit", handleLogin);
  });

  // Add input field animations
  document.querySelectorAll("input").forEach((input) => {
    // Scale animation on focus
    input.addEventListener("focus", () => {
      input.style.transform = "scale(1.02)";
    });

    input.addEventListener("blur", () => {
      input.style.transform = "scale(1)";
    });

    // Handle enter key in password fields
    if (input.type === "password") {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const form = input.closest("form");
          const submitBtn = form.querySelector(".continue");
          submitBtn.click();
        }
      });
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && e.altKey) {
      e.preventDefault();
      const tabs = ["student", "teacher", "admin"];
      const currentTab = document.querySelector(".tab-content.active").id;
      const currentIndex = tabs.indexOf(currentTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      switchToTab(tabs[nextIndex]);
    }
  });
});
