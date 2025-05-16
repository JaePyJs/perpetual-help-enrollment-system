import React from "react";
import Image from "next/image";
import styles from "./Icon.module.css";

const Icon = ({
  type,
  category = "dashboard",
  size = "medium",
  alt,
  onClick,
  className,
}) => {
  const getIconSrc = () => {
    if (category === "dashboard") {
      switch (type) {
        case "grades":
          return "/images/icons/dashboard/grades-icon.png";
        case "finances":
          return "/images/icons/dashboard/finances.png";
        case "schedule":
          return "/images/icons/dashboard/schedule.png";
        case "courses":
          return "/images/icons/dashboard/courses.png";
        case "notifications":
          return "/images/icons/dashboard/notifications.png";
        default:
          return "/images/icons/dashboard/grades-icon.png";
      }
    } else if (category === "status") {
      switch (type) {
        case "success":
          return "/images/icons/status/success-icon.png";
        case "error":
          return "/images/icons/status/error-icon.png";
        case "warning":
          return "/images/icons/status/warning-icon.png";
        case "info":
          return "/images/icons/status/info-icon.png";
        default:
          return "/images/icons/status/info-icon.png";
      }
    }
    return "/images/icons/dashboard/grades-icon.png";
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "large":
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <div
      className={`${styles.icon} ${getSizeClass()} ${className || ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Image
        src={getIconSrc()}
        alt={alt || `${type} icon`}
        width={size === "small" ? 16 : size === "large" ? 48 : 24}
        height={size === "small" ? 16 : size === "large" ? 48 : 24}
        className={styles.iconImage}
      />
    </div>
  );
};

export default Icon;
