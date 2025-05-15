// Theme switcher functionality for student dashboard
document.addEventListener("DOMContentLoaded", function () {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  } else {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.toggle("dark", prefersDark);
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  }

  // Toggle dark mode when theme buttons are clicked
  const lightButton = document.getElementById("light-mode-button");
  const darkButton = document.getElementById("dark-mode-button");
  const systemButton = document.getElementById("system-mode-button");

  if (lightButton) {
    lightButton.addEventListener("click", function () {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      updateActiveThemeButton("light");
    });
  }

  if (darkButton) {
    darkButton.addEventListener("click", function () {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      updateActiveThemeButton("dark");
    });
  }

  if (systemButton) {
    systemButton.addEventListener("click", function () {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
      updateActiveThemeButton("system");
    });
  }

  // Update the active theme button based on current theme
  updateActiveThemeButton(getCurrentThemeMode());

  function getCurrentThemeMode() {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      return "system";
    }
    return savedTheme;
  }

  function updateActiveThemeButton(mode) {
    const buttons = document.querySelectorAll(".theme-button");
    buttons.forEach((button) => button.classList.remove("active"));

    let activeButton;
    switch (mode) {
      case "light":
        activeButton = document.getElementById("light-mode-button");
        break;
      case "dark":
        activeButton = document.getElementById("dark-mode-button");
        break;
      case "system":
        activeButton = document.getElementById("system-mode-button");
        break;
    }

    if (activeButton) {
      activeButton.classList.add("active");
    }
  }
});
