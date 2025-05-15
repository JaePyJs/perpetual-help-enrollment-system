// src/app/components/Loading.tsx
import React from "react";

type LoadingProps = {
  size?: "small" | "medium" | "large";
  message?: string;
};

export default function Loading({
  size = "medium",
  message = "Loading...",
}: LoadingProps) {
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div
          className={`${sizeClass[size]} border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
        ></div>
      </div>
      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
}
