"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const teacherInfo = {
  name: "Prof. Maria Santos",
  id: "T-2023-0142",
  avatar: "/images/teacher-profile.png",
};

const stats = [
  {
    title: "Total Classes",
    icon: "chalkboard",
    value: 7,
    change: "0%",
    changeLabel: "from last semester",
    changeIcon: "equals",
    changeColor: "#e77f33",
    footerIcon: "users",
  },
  {
    title: "Total Students",
    icon: "user-graduate",
    value: 245,
    change: "12%",
    changeLabel: "from last semester",
    changeIcon: "arrow-up",
    changeColor: "#e77f33",
    footerIcon: "graduation-cap",
  },
  {
    title: "Avg. Attendance",
    icon: "clipboard-check",
    value: "92%",
    change: "4%",
    changeLabel: "from last month",
    changeIcon: "arrow-up",
    changeColor: "#e77f33",
    footerIcon: "chart-line",
  },
  {
    title: "Class Avg. Grade",
    icon: "award",
    value: "85%",
    change: "2%",
    changeLabel: "from last quarter",
    changeIcon: "arrow-up",
    changeColor: "#e77f33",
    footerIcon: "percentage",
  },
];

const todayClasses = [
  {
    name: "Computer Programming I",
    code: "CSC-101",
    time: "8:00 AM - 10:00 AM",
    students: 35,
  },
  {
    name: "Web Development",
    code: "CSC-234",
    time: "1:00 PM - 3:00 PM",
    students: 28,
  },
  {
    name: "Database Systems",
    code: "CSC-211",
    time: "4:00 PM - 6:00 PM",
    students: 32,
  },
];

const pendingTasks = [
  {
    task: "Grade Midterm Papers",
    course: "CSC-101",
    deadline: "May 11, 2025",
    priority: "High",
    status: "In Progress",
    priorityClass: "high",
    statusClass: "in-progress",
  },
  {
    task: "Prepare Final Exam",
    course: "CSC-234",
    deadline: "May 15, 2025",
    priority: "Medium",
    status: "Not Started",
    priorityClass: "medium",
    statusClass: "not-started",
  },
  {
    task: "Submit Course Evaluation",
    course: "All Courses",
    deadline: "May 20, 2025",
    priority: "Medium",
    status: "Not Started",
    priorityClass: "medium",
    statusClass: "not-started",
  },
  {
    task: "Update Syllabus",
    course: "CSC-211",
    deadline: "May 25, 2025",
    priority: "Low",
    status: "Not Started",
    priorityClass: "low",
    statusClass: "not-started",
  },
];

const navSections = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "classes", label: "My Classes", icon: "graduation-cap" },
  { id: "grades", label: "Grade Management", icon: "chart-line" },
  { id: "attendance", label: "Attendance", icon: "clipboard-list" },
  { id: "calendar", label: "Calendar", icon: "calendar-alt" },
];

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Teacher Panel</h2>
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Image
            src="/images/phcm-logo.svg"
            alt="PHCM Logo"
            width={60}
            height={60}
            style={{ margin: "0 auto 0.5rem" }}
          />
          <div>
            <h3 style={{ color: "#ffffff", margin: 0, fontSize: "1rem" }}>
              Perpetual Help
            </h3>
            <p style={{ color: "#e77f33", margin: 0, fontSize: "0.85rem" }}>
              College of Manila
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#e77f33",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.5rem",
              }}
            >
              <i
                className="fas fa-chalkboard-teacher"
                style={{ color: "white", fontSize: "1.25rem" }}
              />
            </div>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {teacherInfo.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
              ID: {teacherInfo.id}
            </div>
          </div>
        </div>
        <ul style={{ textAlign: "left", paddingLeft: "1.5rem" }}>
          {navSections.map((section) => (
            <li key={section.id}>
              <a
                href="#"
                className={activeSection === section.id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <i className={`fas fa-${section.icon}`} style={{ width: 20 }} />
                <span style={{ marginLeft: "0.5rem" }}>{section.label}</span>
              </a>
            </li>
          ))}
          <li>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <i className="fas fa-sign-out-alt" style={{ width: 20 }} />
              <span style={{ marginLeft: "0.5rem" }}>Log Out</span>
            </Link>
          </li>
        </ul>
      </aside>
      {/* Main Content */}
      <div className="main-content">
        <main className="flex-1 overflow-y-auto" style={{ padding: 0 }}>
          {/* Dashboard Section */}
          <section
            className={`dashboard-section${
              activeSection === "dashboard" ? " active" : ""
            }`}
          >
            <div className="mb-4">
              <h3 className="section-title" style={{ marginTop: 0 }}>
                Teaching Overview
              </h3>
              <div className="card p-4">
                <p className="text-gray-700 dark:text-gray-200">
                  Welcome, Prof. Santos. You have{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    3
                  </span>{" "}
                  classes today and{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    24
                  </span>{" "}
                  assignments to grade this week.
                </p>
              </div>
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 teacher-stats">
              {stats.map((stat) => (
                <div className="card" key={stat.title}>
                  <div className="card-header">
                    <h3 className="card-title">{stat.title}</h3>
                    <i className={`fas fa-${stat.icon} text-accent`} />
                  </div>
                  <div className="stats-counter">{stat.value}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <span style={{ color: stat.changeColor }}>
                        <i className={`fas fa-${stat.changeIcon} mr-1`} />{" "}
                        {stat.change}
                      </span>
                      <span className="text-xs text-secondary ml-1">
                        {stat.changeLabel}
                      </span>
                    </div>
                    <i
                      className={`fas fa-${stat.footerIcon} text-accent text-lg`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Today's Classes */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Today&apos;s Classes
              </h3>
              <div className="class-schedule">
                {todayClasses.map((cls) => (
                  <div className="schedule-card" key={cls.code}>
                    <h4 className="font-bold text-primary">{cls.name}</h4>
                    <p className="text-secondary">{cls.code}</p>
                    <div className="schedule-meta">
                      <span>
                        <i className="far fa-clock mr-1" /> {cls.time}
                      </span>
                      <span>
                        <i className="fas fa-users mr-1" /> {cls.students}{" "}
                        students
                      </span>
                    </div>
                    <div className="text-right mt-2">
                      <a
                        href="#"
                        className="btn-primary px-3 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pending Tasks */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Pending Tasks
              </h3>
              <div className="card overflow-hidden">
                <table className="data-table min-w-full rounded-lg overflow-hidden">
                  <thead className="table-header">
                    <tr>
                      <th className="px-4 py-3 text-left">Task</th>
                      <th className="px-4 py-3 text-left">Course</th>
                      <th className="px-4 py-3 text-left">Deadline</th>
                      <th className="px-4 py-3 text-left">Priority</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTasks.map((task) => (
                      <tr
                        key={task.task}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-3">{task.task}</td>
                        <td className="px-4 py-3">{task.course}</td>
                        <td className="px-4 py-3">{task.deadline}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs priority-${task.priorityClass}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs status-${task.statusClass}`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* Other Sections (placeholders) */}
          <section
            className={`dashboard-section${
              activeSection === "classes" ? " active" : ""
            }`}
          >
            <h3 className="section-title">My Classes</h3>
            {/* Class content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "grades" ? " active" : ""
            }`}
          >
            <h3 className="section-title">Grade Management</h3>
            {/* Grades content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "attendance" ? " active" : ""
            }`}
          >
            <h3 className="section-title">Attendance Tracking</h3>
            {/* Attendance content would go here */}
          </section>
          <section
            className={`dashboard-section${
              activeSection === "calendar" ? " active" : ""
            }`}
          >
            <h3 className="section-title">Academic Calendar</h3>
            {/* Calendar content would go here */}
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
