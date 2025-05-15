// src/app/ThemeSwitcher.tsx
"use client";
import { useTheme } from "@/lib/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <button
        className={`theme-button${theme === "light" ? " selected" : ""}`}
        aria-label="Light Mode"
        onClick={() => setTheme("light")}
        tabIndex={0}
        type="button"
      >
        <span role="img" aria-label="Light">
          <i className="fas fa-sun" />
        </span>
      </button>
      <button
        className={`theme-button${theme === "dark" ? " selected" : ""}`}
        aria-label="Dark Mode"
        onClick={() => setTheme("dark")}
        tabIndex={0}
        type="button"
      >
        <span role="img" aria-label="Dark">
          <i className="fas fa-moon" />
        </span>
      </button>
    </div>
  );
}
