"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "@/lib/ThemeContext";
import { ToastProvider } from "@/lib/ToastContext";
import ThemeRegistry from "./ThemeRegistry";

/**
 * Providers Component
 * 
 * Combines all application providers in the correct order.
 * This ensures consistent context availability throughout the app.
 * 
 * @param children - The application components to be wrapped with providers
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeRegistry>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ThemeRegistry>
  );
}
