// src/lib/ThemeContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";

// Define available themes
export type Theme = "light" | "dark" | "system";

// Define the context shape
interface ThemeContextType {
  theme: Theme;
  effectiveTheme: "light" | "dark"; // The actual theme applied (resolves "system")
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create context with undefined default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Local storage key for theme preference
const THEME_STORAGE_KEY = "perpetual-help-theme";

/**
 * Theme Provider Component
 *
 * Provides theme context to the application with:
 * - Theme state management
 * - System preference detection
 * - Local storage persistence
 * - Document class updates for styling
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Theme state (user preference)
  const [theme, setThemeState] = useState<Theme>("system");

  // Effective theme (what's actually applied, resolving "system" to light/dark)
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );

  // Update effective theme based on system preference when needed
  const updateEffectiveTheme = useCallback((currentTheme: Theme) => {
    if (currentTheme === "system") {
      // For "system" theme, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setEffectiveTheme(prefersDark ? "dark" : "light");
    } else {
      // For explicit themes, use the selected theme
      setEffectiveTheme(currentTheme as "light" | "dark");
    }
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Try to get saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    // Use saved theme if available, otherwise default to "system"
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    // Initial calculation of effective theme
    updateEffectiveTheme(savedTheme || "system");
  }, [updateEffectiveTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Only update if current theme is "system"
      if (theme === "system") {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    // Add listener and initial calculation
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Update document classes and localStorage when theme changes
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update effective theme
    updateEffectiveTheme(theme);
  }, [theme, updateEffectiveTheme]);

  // Update document classes when effective theme changes
  useEffect(() => {
    // Update document classes for styling
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Set theme with validation
  const setTheme = useCallback((newTheme: Theme) => {
    if (["light", "dark", "system"].includes(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);

  // Toggle between light and dark (skipping system)
  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      // If system, default to light when toggling
      if (prevTheme === "system") {
        return effectiveTheme === "light" ? "dark" : "light";
      }
      // Otherwise toggle between light and dark
      return prevTheme === "light" ? "dark" : "light";
    });
  }, [effectiveTheme]);

  // Context value
  const contextValue = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use the theme context
 *
 * @returns ThemeContextType
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
