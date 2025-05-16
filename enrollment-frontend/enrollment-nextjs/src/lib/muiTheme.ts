// src/lib/muiTheme.ts
import { createTheme } from "@mui/material/styles";

/**
 * Perpetual Help College MUI Theme
 *
 * This theme aligns with our design system colors and typography.
 * Primary: Orange (#e77f33) - Brand color
 * Secondary: Blue - Complementary to orange
 * Accent: Purple - For highlights and special elements
 */
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#e77f33", // Primary orange (brand color)
      light: "#ff8a4c",
      dark: "#dd6b20",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3f83f8", // Secondary blue (complementary)
      light: "#76a9fa",
      dark: "#1c64f2",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#fee2e2",
      dark: "#b91c1c",
    },
    warning: {
      main: "#f59e0b",
      light: "#fef3c7",
      dark: "#b45309",
    },
    info: {
      main: "#3b82f6",
      light: "#dbeafe",
      dark: "#1d4ed8",
    },
    success: {
      main: "#10b981",
      light: "#d1fae5",
      dark: "#047857",
    },
    text: {
      primary: "#111827", // neutral-900
      secondary: "#4b5563", // neutral-600
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "Poppins",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "Inter, sans-serif",
    },
    subtitle2: {
      fontFamily: "Inter, sans-serif",
    },
    body1: {
      fontFamily: "Inter, sans-serif",
    },
    body2: {
      fontFamily: "Inter, sans-serif",
    },
    button: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          padding: "0.5rem 1.5rem",
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

// Create a dark theme variant
export const darkMuiTheme = createTheme({
  ...muiTheme,
  palette: {
    ...muiTheme.palette,
    mode: "dark",
    primary: {
      main: "#ff8a4c", // Lighter orange for dark mode
      dark: "#e77f33",
      light: "#fdba8c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#76a9fa", // Lighter blue for dark mode
      dark: "#3f83f8",
      light: "#a4cafe",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Dark card background
    },
    text: {
      primary: "#f9fafb", // neutral-50 in dark mode
      secondary: "#d1d5db", // neutral-300 in dark mode
    },
  },
  components: {
    ...muiTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          borderRadius: "0.75rem",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -2px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          padding: "0.5rem 1.5rem",
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)",
          },
        },
      },
    },
  },
});
