"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastType } from "@/app/components/Toast";

// Define the shape of a toast notification
interface ToastNotification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Define the shape of the toast context
interface ToastContextType {
  toasts: ToastNotification[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider Component
 * 
 * Provides toast notification functionality to the application.
 * Manages the state of active toast notifications.
 * 
 * @param children - The child components that will have access to the toast context
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Show a new toast notification
  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, message, type, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Automatically remove toast after duration
    setTimeout(() => {
      hideToast(id);
    }, duration);
  };

  // Hide a specific toast notification
  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      
      {/* Render all active toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * 
 * Custom hook to access the toast context.
 * Provides methods to show and hide toast notifications.
 * 
 * @returns The toast context
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}
