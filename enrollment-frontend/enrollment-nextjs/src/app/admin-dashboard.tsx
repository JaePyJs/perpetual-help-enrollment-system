"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin-dashboard.module.css";
import "../styles/style.css";
import "../styles/teacher-dashboard.css";

const adminInfo = {
  name: "Admin User",
  id: "A-2023-0001",
  avatar: "/images/admin.png",
};

const navSections = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "users", label: "User Management", icon: "users" },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "enrollment", label: "Enrollment", icon: "clipboard-list" },
  { id: "reports", label: "Reports", icon: "chart-bar" },
  { id: "settings", label: "Settings", icon: "cog" },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <div className={styles.logoContainer}>
          <Image
            src="/images/phcm-logo.svg"
            alt="PHCM Logo"
            width={60}
            height={60}
            className={styles.logoImage}
          />
          <div>
            <h3 className={styles.collegeName}>Perpetual Help</h3>
            <p className={styles.collegeSubname}>College of Manila</p>
          </div>
        </div>
        <div className={styles.profileSection}>
          <div className={styles.profileContainer}>
            <div className={styles.profileIcon}>
              <i className={`fas fa-user-cog ${styles.iconInner}`} />
            </div>
            <div className={styles.profileName}>{adminInfo.name}</div>
            <div className={styles.profileId}>ID: {adminInfo.id}</div>
          </div>
        </div>
        <ul className={styles.navList}>
          {navSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <Link
                href="#"
                className={`${styles.navLink} ${
                  activeSection === section.id ? styles.active : ""
                }`}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                }}
              >
                <i className={`fas fa-${section.icon} ${styles.navIcon}`} />
                <span className={styles.navLabel}>{section.label}</span>
              </Link>
            </li>
          ))}
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              <i className={`fas fa-sign-out-alt ${styles.navIcon}`} />
              <span className={styles.navLabel}>Log Out</span>
            </Link>
          </li>
          <li>
            <a href="/user-registration">➕ Register User</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Section */}
        <section
          className={`dashboard-section${
            activeSection === "dashboard" ? " active" : ""
          }`}
        >
          <div className="mb-4">
            <h3 className="section-title">Admin Overview</h3>
            <div className="card p-4">
              <p className="text-gray-700 dark:text-gray-200">
                Welcome, Admin! Use the navigation to manage users, courses, and
                view reports.
              </p>
            </div>
          </div>
          {/* Additional admin dashboard content can be added here */}
        </section>
        {/* Other Sections (placeholders) */}
        <section
          className={`dashboard-section${
            activeSection === "users" ? " active" : ""
          }`}
        >
          <h3 className="section-title">User Management</h3>
          {/* User management content would go here */}
        </section>
        <section
          className={`dashboard-section${
            activeSection === "courses" ? " active" : ""
          }`}
        >
          <h3 className="section-title">Courses</h3>
          {/* Courses content would go here */}
        </section>
        <section
          className={`dashboard-section${
            activeSection === "enrollment" ? " active" : ""
          }`}
        >
          <h3 className="section-title">Enrollment</h3>
          {/* Enrollment content would go here */}
        </section>
        <section
          className={`dashboard-section${
            activeSection === "reports" ? " active" : ""
          }`}
        >
          <h3 className="section-title">Reports</h3>
          {/* Reports content would go here */}
        </section>
        <section
          className={`dashboard-section${
            activeSection === "settings" ? " active" : ""
          }`}
        >
          <h3 className="section-title">Settings</h3>
          {/* Settings content would go here */}
        </section>
      </div>
    </div>
  );
}
