import React from "react";
import Image from "next/image";
import styles from "./Avatar.module.css";

const Avatar = ({ type, gender = "male", size = "medium", alt, className }) => {
  const getAvatarSrc = () => {
    switch (type) {
      case "student":
        return gender === "female"
          ? "/images/avatars/female-student-avatar.png"
          : "/images/avatars/male-student-avatar.png";
      case "teacher":
        return gender === "female"
          ? "/images/avatars/female-teacher-avatar.png"
          : "/images/avatars/male-teacher-avatar.png";
      case "admin":
        return "/images/avatars/admin-avatar.png";
      default:
        return "/images/avatars/male-student-avatar.png";
    }
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
    <div className={`${styles.avatar} ${getSizeClass()} ${className || ""}`}>
      <Image
        src={getAvatarSrc()}
        alt={alt || `${type} avatar`}
        width={size === "small" ? 32 : size === "large" ? 96 : 48}
        height={size === "small" ? 32 : size === "large" ? 96 : 48}
        className={styles.avatarImage}
      />
    </div>
  );
};

export default Avatar;
