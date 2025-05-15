"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./student-dashboard.module.css";
import { useAuth } from "@/lib/AuthContext";
import { useSupabaseData } from "@/lib/useSupabaseData";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import {
  StudentInfo,
  StudentStat,
  Course,
  Assignment,
} from "@/types/dashboard";

// Default student avatar for fallback
const DEFAULT_AVATAR = "/images/student-avatar.svg";

// Add authentication guard and loading/error states for dashboard
export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch student profile data
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useSupabaseData<StudentInfo>({
    table: "student_profiles",
    match: { user_id: user?.id },
  });

  // Fetch student statistics
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useSupabaseData<StudentStat>({
    table: "student_stats",
    match: { student_id: profileData?.[0]?.student_id },
  });

  // Fetch enrolled courses
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useSupabaseData<Course>({
    table: "courses",
    match: { student_id: profileData?.[0]?.student_id },
  });

  // Fetch upcoming assignments
  const {
    data: assignmentsData,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useSupabaseData<Assignment>({
    table: "assignments",
    match: { student_id: profileData?.[0]?.student_id },
    order: { column: "due_date", ascending: true },
  });

  // Format assignments to match the UI structure
  const deadlines =
    assignmentsData?.map((assignment) => ({
      assignment: assignment.title,
      course: assignment.course_code,
      due: new Date(assignment.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status:
        assignment.status.charAt(0).toUpperCase() +
        assignment.status.slice(1).replace("-", " "),
      statusClass: assignment.status,
    })) || [];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || profileLoading) {
    return <Loading size="large" message="Loading dashboard..." />;
  }

  if (profileError) {
    return <ErrorMessage message={`Error loading profile: ${profileError}`} />;
  }

  // Get student info from profile data
  const studentInfo =
    profileData && profileData[0]
      ? {
          name: `${profileData[0].first_name} ${profileData[0].last_name}`,
          id: profileData[0].student_id,
          avatar: profileData[0].avatar_url || DEFAULT_AVATAR,
        }
      : {
          name: "Student",
          id: "Unknown",
          avatar: DEFAULT_AVATAR,
        };

  // Navigation sections
  const navSections = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "courses", label: "My Courses", icon: "book" },
    { id: "grades", label: "Grades", icon: "chart-line" },
    { id: "schedule", label: "Schedule", icon: "calendar-alt" },
    { id: "payments", label: "Payments", icon: "receipt" },
    { id: "profile", label: "My Profile", icon: "user" },
  ];

  // Handle navigation to profile page
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/student-profile");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Student Portal</h2>
        <div className={styles.logoContainer}>
          <Image
            src="/images/phcm-logo.svg"
            alt="PHCM Logo"
            width={60}
            height={60}
            className={styles.logoImage}
          />
          <div>
            <h3 className={styles.schoolName}>Perpetual Help</h3>
            <p className={styles.collegeSubname}>College of Manila</p>
          </div>
        </div>
        <div className={styles.profileSection}>
          <div className={styles.profileContainer}>
            <div className={styles.profileIcon}>
              <i className={`fas fa-user-graduate ${styles.iconInner}`} />
            </div>
            <div className={styles.profileName}>{studentInfo.name}</div>
            <div className={styles.profileId}>ID: {studentInfo.id}</div>
          </div>
        </div>
        <ul className={styles.navList}>
          {navSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <Link
                href={section.id === "profile" ? "/student-profile" : "#"}
                className={`${styles.navLink} ${
                  activeSection === section.id ? styles.active : ""
                }`}
                onClick={(e: React.MouseEvent) => {
                  if (section.id === "profile") {
                    handleProfileClick(e);
                  } else {
                    e.preventDefault();
                    setActiveSection(section.id);
                  }
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
        </ul>
      </aside>
      {/* Main Content */}{" "}
      <div className="main-content">
        <main className={`flex-1 overflow-y-auto ${styles.mainContentSection}`}>
          {/* Dashboard Section */}
          <section
            className={`dashboard-section${
              activeSection === "dashboard" ? " active" : ""
            }`}
          >
            <div className="mb-4">
              <h3 className={`section-title ${styles.sectionTitle}`}>
                Academic Overview
              </h3>
              <div className="card p-4">
                <p className="text-gray-700 dark:text-gray-200">
                  Welcome, {profileData?.[0]?.first_name || "Student"}!
                  {statsLoading ? (
                    <Loading
                      size="small"
                      message="Loading your academic overview..."
                    />
                  ) : statsError ? (
                    <ErrorMessage message="Could not load your academic overview." />
                  ) : (
                    <>
                      Your next class is{" "}
                      <span className={`font-bold ${styles.accentText}`}>
                        {(coursesData && coursesData[0]?.name) ||
                          "Computer Science 101"}
                      </span>{" "}
                      at{" "}
                      <span className={`font-bold ${styles.accentText}`}>
                        2:00 PM
                      </span>{" "}
                      today. You have{" "}
                      <span className={`font-bold ${styles.accentText}`}>
                        {deadlines.filter((d) => d.statusClass === "urgent")
                          .length || "3"}
                      </span>{" "}
                      assignments due this week.
                    </>
                  )}
                </p>
              </div>
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 student-stats">
              {statsLoading ? (
                <div className="col-span-4">
                  <Loading size="medium" message="Loading statistics..." />
                </div>
              ) : statsError ? (
                <div className="col-span-4">
                  <ErrorMessage
                    message={`Error loading statistics: ${statsError}`}
                  />
                </div>
              ) : statsData && statsData.length > 0 ? (
                statsData.map((stat) => (
                  <div className="card" key={stat.id}>
                    <div className="card-header">
                      <h3 className="card-title">{stat.title}</h3>
                      <i className={`fas fa-${stat.icon} text-accent`} />
                    </div>
                    <div className="stats-counter">{stat.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span
                          className={
                            `${styles.changeText} ` +
                            (stat.change_color === "#e77f33"
                              ? styles.statChangeOrange
                              : stat.change_color === "#28a745"
                              ? styles.statChangeGreen
                              : stat.change_color === "#dc3545"
                              ? styles.statChangeRed
                              : "")
                          }
                        >
                          <i className={`fas fa-${stat.change_icon} mr-1`} />{" "}
                          {stat.change}
                        </span>
                        <span className="text-xs text-secondary ml-1">
                          {stat.change_label}
                        </span>
                      </div>
                      <i
                        className={`fas fa-${stat.footer_icon} text-accent text-lg`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to static stats if no data available
                [
                  {
                    id: "1",
                    title: "Current GPA",
                    icon: "award",
                    value: 3.75,
                    change: "0.25",
                    change_label: "from last semester",
                    change_icon: "arrow-up",
                    change_color: "#e77f33",
                    footer_icon: "chart-line",
                  },
                  {
                    id: "2",
                    title: "Enrolled Courses",
                    icon: "book",
                    value: coursesData?.length || 6,
                    change: "0",
                    change_label: "from last semester",
                    change_icon: "equals",
                    change_color: "#e77f33",
                    footer_icon: "graduation-cap",
                  },
                  {
                    id: "3",
                    title: "Attendance Rate",
                    icon: "clipboard-check",
                    value: "95%",
                    change: "2%",
                    change_label: "from last month",
                    change_icon: "arrow-up",
                    change_color: "#e77f33",
                    footer_icon: "check-circle",
                  },
                  {
                    id: "4",
                    title: "Credits Completed",
                    icon: "graduation-cap",
                    value: 48,
                    change: "18",
                    change_label: "from last year",
                    change_icon: "arrow-up",
                    change_color: "#e77f33",
                    footer_icon: "certificate",
                  },
                ].map((stat) => (
                  <div className="card" key={stat.id}>
                    <div className="card-header">
                      <h3 className="card-title">{stat.title}</h3>
                      <i className={`fas fa-${stat.icon} text-accent`} />
                    </div>
                    <div className="stats-counter">{stat.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span
                          className={styles.changeText}
                          style={{ color: stat.change_color }}
                        >
                          <i className={`fas fa-${stat.change_icon} mr-1`} />{" "}
                          {stat.change}
                        </span>
                        <span className="text-xs text-secondary ml-1">
                          {stat.change_label}
                        </span>
                      </div>
                      <i
                        className={`fas fa-${stat.footer_icon} text-accent text-lg`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Current Courses */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Current Courses
              </h3>
              {coursesLoading ? (
                <Loading size="medium" message="Loading courses..." />
              ) : coursesError ? (
                <ErrorMessage
                  message={`Error loading courses: ${coursesError}`}
                />
              ) : coursesData && coursesData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coursesData.map((course) => (
                    <div className="course-card" key={course.id}>
                      <h4 className="font-bold text-primary">{course.name}</h4>
                      <p className="text-secondary">{course.description}</p>
                      <div className="mt-2 flex justify-between">
                        <span>Progress: {course.progress}%</span>
                        <span>Grade: {course.grade || "N/A"}</span>
                      </div>
                      <div className="progress-container">
                        <div
                          className={`${styles.progressBar} ${
                            styles[
                              `progressBarWidth${
                                Math.round(course.progress / 10) * 10
                              }`
                            ]
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-4">
                  <p>No courses found. Please contact your academic advisor.</p>
                </div>
              )}
            </div>
            {/* Upcoming Deadlines */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Upcoming Deadlines
              </h3>
              {assignmentsLoading ? (
                <Loading size="medium" message="Loading assignments..." />
              ) : assignmentsError ? (
                <ErrorMessage
                  message={`Error loading assignments: ${assignmentsError}`}
                />
              ) : deadlines.length > 0 ? (
                <div className="card overflow-hidden">
                  <table className="data-table min-w-full rounded-lg overflow-hidden">
                    <thead className="table-header">
                      <tr>
                        <th className="px-4 py-3 text-left">Assignment</th>
                        <th className="px-4 py-3 text-left">Course</th>
                        <th className="px-4 py-3 text-left">Due Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deadlines.map((d, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="px-4 py-3">{d.assignment}</td>
                          <td className="px-4 py-3">{d.course}</td>
                          <td className="px-4 py-3">{d.due}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs status-${d.statusClass}`}
                            >
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card p-4">
                  <p>No upcoming deadlines found.</p>
                </div>
              )}
            </div>
          </section>
          {/* Other Sections (placeholders) */}
          <section
            className={`dashboard-section${
              activeSection === "courses" ? " active" : ""
            }`}
          >
            <h3 className="section-title">My Courses</h3>
            {/* Courses content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "grades" ? " active" : ""
            }`}
          >
            <h3 className="section-title">My Grades</h3>
            {/* Grades content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "schedule" ? " active" : ""
            }`}
          >
            <h3 className="section-title">Class Schedule</h3>
            {/* Schedule content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "payments" ? " active" : ""
            }`}
          >
            <h3 className="section-title">Payment History</h3>
            {/* Payments content would go here */}
          </section>
        </main>
        <footer className="p-4 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700">
          <p>
            &copy; 2025 Perpetual Help College of Manila. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
