import React from "react";

/**
 * Select Component
 * 
 * A versatile select component that follows the design system.
 * Supports different states and validation.
 */
type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  name: string;
  options: SelectOption[];
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  fullWidth?: boolean;
  placeholder?: string;
};

export default function Select({
  id,
  name,
  options,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  helperText,
  className = "",
  fullWidth = false,
  placeholder,
}: SelectProps) {
  // Combine class names based on props
  const selectWrapperClasses = [
    "form-group",
    fullWidth ? "w-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const selectClasses = [
    "form-select",
    error ? "form-select-error" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={selectWrapperClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={selectClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
