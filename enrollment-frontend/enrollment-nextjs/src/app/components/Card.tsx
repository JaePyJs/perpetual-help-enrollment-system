import React from "react";

/**
 * Card Component
 *
 * A versatile card component that follows the design system.
 * Supports different variants and content sections.
 */
type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "bordered";
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
};

export default function Card({
  children,
  className = "",
  variant = "default",
  title,
  subtitle,
  footer,
  headerAction,
}: CardProps) {
  // Combine class names based on props
  const cardClasses = [
    "card",
    variant === "compact" ? "card-compact" : "",
    variant === "bordered" ? "card-bordered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="card-header-action">{headerAction}</div>
          )}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
