// src/app/ThemeSwitcher.tsx
"use client";
import { useTheme, Theme } from "@/lib/ThemeContext";
import { Tooltip } from "@mui/material";

/**
 * Theme Switcher Component
 *
 * Provides a UI for switching between light, dark, and system themes.
 * Uses MUI Tooltip for better accessibility and user experience.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Helper function to determine if a button is selected
  const isSelected = (buttonTheme: Theme) => theme === buttonTheme;

  return (
    <div className="theme-switcher">
      <Tooltip title="Light Mode" arrow>
        <button
          className={`theme-button${isSelected("light") ? " selected" : ""}`}
          aria-label="Light Mode"
          onClick={() => setTheme("light")}
          tabIndex={0}
          type="button"
        >
          <span role="img" aria-label="Light">
            <i className="fas fa-sun" />
          </span>
        </button>
      </Tooltip>

      <Tooltip title="Dark Mode" arrow>
        <button
          className={`theme-button${isSelected("dark") ? " selected" : ""}`}
          aria-label="Dark Mode"
          onClick={() => setTheme("dark")}
          tabIndex={0}
          type="button"
        >
          <span role="img" aria-label="Dark">
            <i className="fas fa-moon" />
          </span>
        </button>
      </Tooltip>

      <Tooltip title="Use System Preference" arrow>
        <button
          className={`theme-button${isSelected("system") ? " selected" : ""}`}
          aria-label="System Theme"
          onClick={() => setTheme("system")}
          tabIndex={0}
          type="button"
        >
          <span role="img" aria-label="System">
            <i className="fas fa-desktop" />
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
