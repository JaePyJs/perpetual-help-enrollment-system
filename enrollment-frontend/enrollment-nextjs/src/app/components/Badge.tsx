import React from "react";

/**
 * Badge Component
 * 
 * A versatile badge component that follows the design system.
 * Used for status indicators, counts, and labels.
 */
type BadgeProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  className?: string;
};

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  // Combine class names based on props
  const badgeClasses = [
    "badge",
    `badge-${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
}
