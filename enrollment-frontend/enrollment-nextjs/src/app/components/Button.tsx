import React from "react";

const buttonStyle: React.CSSProperties = {
  transition: "background 0.2s, transform 0.1s",
};
const hoverStyle: React.CSSProperties = {
  background: "#d86e21",
  transform: "scale(1.03)",
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "primary-btn",
  disabled = false,
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      style={hovered ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {children}
    </button>
  );
} 