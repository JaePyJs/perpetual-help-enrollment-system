// From reference/admin-dashboard.js
const API_ENDPOINTS = {
  login: "/api/login",
  logout: "/api/logout",
  getUsers: "/api/users",
  addUser: "/api/users",
  updateUser: "/api/users/",
  deleteUser: "/api/users/",
  getStats: "/api/stats",
  getNotifications: "/api/notifications",
  getPasswordResets: "/api/password-resets",
  getAdminActions: "/api/admin-actions",
};

let currentAdmin = {
  id: null,
  name: "Admin",
  email: "",
};

document.addEventListener("DOMContentLoaded", function () {
  loadAdminData();
  loadDashboardStats();

  document
    .getElementById("user-password")
    ?.addEventListener("input", function () {
      checkPasswordStrength(this.value, "strength-indicator", "strength-text");
    });

  document
    .getElementById("new-password")
    ?.addEventListener("input", function () {
      checkPasswordStrength(
        this.value,
        "edit-strength-indicator",
        "edit-strength-text"
      );
    });
});

function loadAdminData() {
  document.getElementById("admin-name").textContent = currentAdmin.name;
}

function loadDashboardStats() {
  document.getElementById("total-users").textContent = "124";
  document.getElementById("pending-requests").textContent = "5";
}

function showContent(section) {
  document.querySelectorAll(".content-section").forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById(`${section}-content`).style.display = "block";
  hideUserPanels();

  if (section === "users") {
    searchUsers();
  } else if (section === "reports") {
    loadReports();
  } else if (section === "settings") {
    loadSettings();
  }
}

function showUserPanel(panel) {
  hideUserPanels();
  document.getElementById(`${panel}-panel`).style.display = "block";

  if (panel === "view-logs") {
    loadLogs();
  }
}

function hideUserPanels() {
  document.querySelectorAll(".user-panel").forEach((panel) => {
    panel.style.display = "none";
  });
}

function searchUsers() {
  const searchTerm = document.getElementById("search-user").value.toLowerCase();
  const userList = document.getElementById("user-list");

  userList.innerHTML = '<div class="loading">Loading users...</div>';

  setTimeout(() => {
    const users = [
      { id: "1", name: "John Doe", email: "john@school.edu", type: "teacher" },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@school.edu",
        type: "student",
      },
      { id: "3", name: "Admin User", email: "admin@school.edu", type: "admin" },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    displayUsers(users, userList, "remove");
  }, 500);
}

function searchUsersForEdit() {
  const searchTerm = document
    .getElementById("modify-search")
    .value.toLowerCase();
  const userList = document.getElementById("edit-user-list");

  userList.innerHTML = '<div class="loading">Loading users...</div>';

  setTimeout(() => {
    const users = [
      { id: "1", name: "John Doe", email: "john@school.edu", type: "teacher" },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@school.edu",
        type: "student",
      },
      { id: "3", name: "Admin User", email: "admin@school.edu", type: "admin" },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    displayUsers(users, userList, "edit");
  }, 500);
}

function displayUsers(users, container, action) {
  if (users.length === 0) {
    container.innerHTML = '<div class="loading">No users found</div>';
    return;
  }

  container.innerHTML = "";

  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.className = "user-item";
    userElement.innerHTML = `
      <span>${user.name} (${user.email}) - ${user.type}</span>
      <button class="${action === "remove" ? "remove-btn" : "modify-btn"}" 
              onclick="${
                action === "remove"
                  ? `removeUser('${user.id}')`
                  : `loadUserForEdit('${user.id}')`
              }">
        ${action === "remove" ? "Remove" : "Edit"}
      </button>
    `;
    container.appendChild(userElement);
  });
}

function addUser(event) {
  event.preventDefault();

  const userType = document.getElementById("user-type").value;
  const userName = document.getElementById("user-name").value;
  const userEmail = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long!");
    return;
  }

  const newUser = {
    name: userName,
    email: userEmail,
    type: userType,
    password: password,
  };

  alert(`Would create user: ${JSON.stringify(newUser)}`);
  document.getElementById("add-user-form").reset();
  hideUserPanels();
  loadDashboardStats();
}

function removeUser(userId) {
  if (!confirm("Are you sure you want to remove this user?")) return;

  alert(`Would remove user with ID: ${userId}`);
  searchUsers();
  loadDashboardStats();
}

function loadUserForEdit(userId) {
  const user = {
    id: userId,
    name: "John Doe",
    email: "john@school.edu",
    type: "teacher",
  };

  document.getElementById("edit-user-id").value = user.id;
  document.getElementById("edit-user-name").value = user.name;
  document.getElementById("edit-user-email").value = user.email;
  document.getElementById("edit-user-type").value = user.type;
  document.getElementById("edit-user-form").style.display = "block";
}

function saveUserChanges(event) {
  event.preventDefault();

  const userId = document.getElementById("edit-user-id").value;
  const userName = document.getElementById("edit-user-name").value;
  const userEmail = document.getElementById("edit-user-email").value;
  const userType = document.getElementById("edit-user-type").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword || confirmPassword) {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
  }

  const updatedUser = {
    name: userName,
    email: userEmail,
    type: userType,
  };

  if (newPassword) {
    updatedUser.password = newPassword;
  }

  alert("User updated successfully!");
  document.getElementById("edit-user-form").style.display = "none";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

function cancelEdit() {
  document.getElementById("edit-user-form").style.display = "none";
}

function checkPasswordStrength(password, indicatorId, textId) {
  const indicator = document.querySelector(`.${indicatorId}`);
  const text = document.querySelector(`.${textId}`);

  indicator.className = `strength-indicator`;
  text.textContent = "";

  if (!password) return;

  let strength = 0;

  if (password.length > 7) strength++;
  if (password.length > 11) strength++;

  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength < 3) {
    indicator.classList.add("strength-weak");
    text.textContent = "Weak";
  } else if (strength < 5) {
    indicator.classList.add("strength-medium");
    text.textContent = "Medium";
  } else {
    indicator.classList.add("strength-strong");
    text.textContent = "Strong";
  }
}

function togglePasswordVisibility() {
  const show = document.getElementById("show-passwords").checked;
  const newPass = document.getElementById("user-password");
  const confirmPass = document.getElementById("confirm-password");

  newPass.type = show ? "text" : "password";
  confirmPass.type = show ? "text" : "password";
}

function toggleEditPasswordVisibility() {
  const show = document.getElementById("show-edit-passwords").checked;
  const newPass = document.getElementById("new-password");
  const confirmPass = document.getElementById("confirm-password");

  newPass.type = show ? "text" : "password";
  confirmPass.type = show ? "text" : "password";
}

function loadLogs() {
  document.getElementById("teacher-notifications").innerHTML = `
    <div class="log-item">
      <p><strong>Ms. Johnson:</strong> Requested classroom supplies</p>
      <span class="log-time">2 hours ago</span>
    </div>
  `;

  document.getElementById("student-notifications").innerHTML = `
    <div class="log-item">
      <p><strong>Alex Turner:</strong> Reported issue with login</p>
      <span class="log-time">1 day ago</span>
    </div>
  `;

  document.getElementById("admin-notifications").innerHTML = `
    <div class="log-item">
      <p><strong>Admin Smith:</strong> Scheduled system maintenance</p>
      <span class="log-time">3 days ago</span>
    </div>
  `;

  document.getElementById("password-reset-list").innerHTML = `
    <div class="log-item">
      <p><strong>student123@school.edu</strong> - Requested 2023-11-15</p>
      <span class="log-status resolved">Resolved</span>
    </div>
    <div class="log-item">
      <p><strong>teacher456@school.edu</strong> - Requested 2023-11-14</p>
      <span class="log-status pending">Pending</span>
    </div>
  `;

  document.getElementById("admin-actions-list").innerHTML = `
    <div class="log-item">
      <p><strong>Admin Doe</strong> created new user <strong>teacher789@school.edu</strong></p>
      <span class="log-time">Yesterday at 2:30 PM</span>
    </div>
    <div class="log-item">
      <p><strong>Admin Smith</strong> modified permissions for <strong>Student Group A</strong></p>
      <span class="log-time">November 10, 2023</span>
    </div>
  `;
}

function showLogTab(tab) {
  document.querySelectorAll(".log-tab-content").forEach((tab) => {
    tab.style.display = "none";
  });
  document.getElementById(`${tab}-tab`).style.display = "block";

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}

function loadReports() {
  document.getElementById("reports-container").innerHTML = `
    <div class="loading">Reports will be displayed here</div>
  `;
}

function loadSettings() {
  document.getElementById("settings-container").innerHTML = `
    <div class="loading">Settings will be displayed here</div>
  `;
}
