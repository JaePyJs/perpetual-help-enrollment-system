import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function Card({ children, className = "card", title }: CardProps) {
  return (
    <div className={className}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
} 