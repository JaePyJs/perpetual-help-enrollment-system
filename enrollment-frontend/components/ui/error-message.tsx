"use client";

import React from "react";
import { AlertCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorMessageProps {
  title?: string;
  message: string | React.ReactNode;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function ErrorMessage({
  title,
  message,
  severity = "error",
  onRetry,
  className = "",
  dismissible = false,
  onDismiss,
}: ErrorMessageProps) {
  // Define colors and icons based on severity
  const severityConfig = {
    error: {
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-400 dark:border-red-800",
      textColor: "text-red-800 dark:text-red-300",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-400 dark:border-yellow-800",
      textColor: "text-yellow-800 dark:text-yellow-300",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-400 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-300",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const { bgColor, borderColor, textColor, icon } = severityConfig[severity];

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-md p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="ml-3 w-full">
          <div className="flex justify-between items-start">
            <div>
              {title && (
                <h3 className="text-sm font-medium mb-1">{title}</h3>
              )}
              <div className="text-sm">{message}</div>
            </div>
            {dismissible && (
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-20 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={onDismiss}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
          {onRetry && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onRetry}
                className="text-sm font-medium underline hover:text-opacity-80"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ApiErrorMessage({
  error,
  onRetry,
  className,
  dismissible,
  onDismiss,
}: {
  error: any;
  onRetry?: () => void;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}) {
  // Extract error message from different error types
  let errorMessage = "An unexpected error occurred";
  let errorTitle = "Error";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorTitle = error.name !== "Error" ? error.name : "Error";
  } else if (error && typeof error === "object") {
    if (error.message) {
      errorMessage = error.message;
    }
    if (error.name) {
      errorTitle = error.name;
    }
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    }
  }

  return (
    <ErrorMessage
      title={errorTitle}
      message={errorMessage}
      severity="error"
      onRetry={onRetry}
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
}

export default ErrorMessage;
