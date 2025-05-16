import React from "react";

/**
 * Form Component
 * 
 * A versatile form component that follows the design system.
 * Provides consistent layout and submission handling.
 */
type FormProps = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  id?: string;
  autoComplete?: "on" | "off";
  noValidate?: boolean;
};

export default function Form({
  children,
  onSubmit,
  className = "",
  id,
  autoComplete = "on",
  noValidate = false,
}: FormProps) {
  // Combine class names based on props
  const formClasses = [
    "form",
    className,
  ].filter(Boolean).join(" ");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      id={id}
      className={formClasses}
      onSubmit={handleSubmit}
      autoComplete={autoComplete}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
}

/**
 * FormRow Component
 * 
 * A layout component for form fields.
 * Provides consistent spacing and alignment.
 */
type FormRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function FormRow({ children, className = "" }: FormRowProps) {
  const rowClasses = [
    "form-row",
    className,
  ].filter(Boolean).join(" ");

  return <div className={rowClasses}>{children}</div>;
}

/**
 * FormActions Component
 * 
 * A layout component for form actions (buttons).
 * Provides consistent spacing and alignment.
 */
type FormActionsProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
};

export function FormActions({
  children,
  className = "",
  align = "right",
}: FormActionsProps) {
  const actionsClasses = [
    "form-actions",
    `form-actions-${align}`,
    className,
  ].filter(Boolean).join(" ");

  return <div className={actionsClasses}>{children}</div>;
}
