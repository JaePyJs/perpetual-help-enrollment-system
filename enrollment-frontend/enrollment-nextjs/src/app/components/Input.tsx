import React from "react";

/**
 * Input Component
 * 
 * A versatile input component that follows the design system.
 * Supports different types, states, and validation.
 */
type InputProps = {
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export default function Input({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  helperText,
  className = "",
  fullWidth = false,
  icon,
  iconPosition = "left",
}: InputProps) {
  // Combine class names based on props
  const inputWrapperClasses = [
    "form-group",
    fullWidth ? "w-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const inputClasses = [
    "form-input",
    error ? "form-input-error" : "",
    icon ? `form-input-with-icon-${iconPosition}` : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />
        {icon && iconPosition === "right" && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper">
          {helperText}
        </p>
      )}
    </div>
  );
}
