"use client";

import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullPage?: boolean;
  transparent?: boolean;
}

export function Loading({
  size = "medium",
  text = "Loading...",
  fullPage = false,
  transparent = false,
}: LoadingProps) {
  // Determine spinner size based on the size prop
  const spinnerSizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const spinnerSize = spinnerSizes[size];

  // Full page loading overlay
  if (fullPage) {
    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${
          transparent ? "bg-opacity-50" : "bg-opacity-90"
        } bg-background`}
      >
        <div className="flex flex-col items-center justify-center p-4 rounded-lg">
          <div
            className={`${spinnerSize} border-4 border-primary/30 border-t-primary rounded-full animate-spin`}
          ></div>
          {text && (
            <p className="mt-4 text-sm font-medium text-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }

  // Inline loading spinner
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${spinnerSize} border-4 border-primary/30 border-t-primary rounded-full animate-spin`}
      ></div>
      {text && <p className="ml-3 text-sm font-medium text-foreground">{text}</p>}
    </div>
  );
}

export function LoadingButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative ${props.className || ""}`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </span>
      )}
      <span className={loading ? "invisible" : ""}>{children}</span>
    </button>
  );
}

export function LoadingDots({
  color = "currentColor",
  size = "medium",
}: {
  color?: string;
  size?: "small" | "medium" | "large";
}) {
  const dotSizes = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3",
  };

  const dotSize = dotSizes[size];
  const gapSizes = {
    small: "gap-1",
    medium: "gap-2",
    large: "gap-3",
  };

  const gapSize = gapSizes[size];

  return (
    <div className={`flex ${gapSize}`}>
      <div
        className={`${dotSize} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "0ms",
        }}
      ></div>
      <div
        className={`${dotSize} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "150ms",
        }}
      ></div>
      <div
        className={`${dotSize} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "300ms",
        }}
      ></div>
    </div>
  );
}

export function LoadingCard({
  rows = 3,
  height = "h-32",
}: {
  rows?: number;
  height?: string;
}) {
  return (
    <div
      className={`w-full ${height} rounded-lg bg-muted animate-pulse p-4 flex flex-col gap-3`}
    >
      <div className="w-3/4 h-4 bg-muted-foreground/20 rounded"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="w-full h-3 bg-muted-foreground/20 rounded"
          style={{
            width: `${Math.floor(Math.random() * 40) + 60}%`,
          }}
        ></div>
      ))}
    </div>
  );
}

export default Loading;
