import React from "react";

/**
 * Alert Component
 * 
 * A versatile alert component that follows the design system.
 * Used for notifications, warnings, and errors.
 */
type AlertProps = {
  children: React.ReactNode;
  variant: "success" | "warning" | "danger" | "info";
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export default function Alert({
  children,
  variant,
  title,
  icon,
  className = "",
  onClose,
}: AlertProps) {
  // Combine class names based on props
  const alertClasses = [
    "alert",
    `alert-${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={alertClasses} role="alert">
      {icon && <div className="alert-icon">{icon}</div>}
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close alert"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}
