"use client";
import React, { useState } from "react";
import "../styles/style.css";
import "../styles/student-enrollment.css";

const studentInfo = {
  id: "m23-1470-578",
  name: "Juan Dela Cruz",
  dept: "BSIT",
};

const academicTerm = {
  year: "2024-2025",
  semester: "1st",
  yearLevel: "2",
  status: "Pending",
};

const enrollmentSchedule = {
  regular: "May 15, 2025 - June 15, 2025",
  late: "June 16, 2025 - June 30, 2025",
  addDrop: "June 16, 2025 - July 15, 2025",
  classesStart: "June 5, 2025",
};

const subjects = [
  {
    id: 1,
    code: "IT201",
    title: "Data Structures and Algorithms",
    units: "3 units (2 lec, 1 lab)",
    prereq: "IT102 - Computer Programming 1",
    sections: [
      "Section A (M/W 9:00AM-10:30AM, Rm 305)",
      "Section B (T/Th 1:00PM-2:30PM, Rm 307)",
    ],
  },
  {
    id: 2,
    code: "IT202",
    title: "Information Management",
    units: "3 units (2 lec, 1 lab)",
    prereq: "None",
    sections: [
      "Section A (M/W 1:00PM-2:30PM, Rm 305)",
      "Section B (T/Th 9:00AM-10:30AM, Rm 307)",
    ],
  },
  {
    id: 3,
    code: "GE103",
    title: "Purposive Communication",
    units: "3 units (3 lec, 0 lab)",
    prereq: "None",
    sections: [
      "Section A (M/W 3:00PM-4:30PM, Rm 205)",
      "Section B (T/Th 10:30AM-12:00PM, Rm 207)",
    ],
  },
  {
    id: 4,
    code: "GE104",
    title: "Mathematics in the Modern World",
    units: "3 units (3 lec, 0 lab)",
    prereq: "None",
    sections: [
      "Section A (M/W 7:30AM-9:00AM, Rm 105)",
      "Section B (T/Th 3:00PM-4:30PM, Rm 107)",
    ],
  },
];

export default function StudentEnrollment() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<{ [id: number]: string }>({});

  const handleCheckbox = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (!checked) delete copy[id];
      else copy[id] = subjects.find((s) => s.id === id)?.sections[0] || "";
      return copy;
    });
  };

  const handleSection = (id: number, value: string) => {
    setSelected((prev) => ({ ...prev, [id]: value }));
  };

  const selectedSubjects = subjects.filter((s) => selected[s.id]);
  const totalUnits = selectedSubjects.length * 3; // Simplified
  const estimatedTuition = totalUnits * 1500;

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <div className="menu-section">
          <h3>Main Menu</h3>
          <ul>
            <li>
              <a href="#">📢 Site News</a>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Navigation</h3>
          <ul>
            <li>
              <a href="/student-dashboard">🏠 Dashboard</a>
            </li>
            <li>
              <a href="#" className="active">
                📝 Enrollment
              </a>
            </li>
            <li>
              <a href="#">📚 My Courses</a>
            </li>
            <li>
              <a href="#">💰 Finances</a>
            </li>
            <li>
              <a href="#">📊 Grades</a>
            </li>
            <li>
              <a href="#">👤 Profile</a>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Calendar</h3>
          <div className="calendar-box">📅 May 2025</div>
        </div>
        <div className="menu-section">
          <h3>Activities</h3>
          <ul>
            <li>
              <a href="#">💬 Forums</a>
            </li>
          </ul>
        </div>
      </aside>
      <main className="main-content">
        <div className="header">
          <h1>Student Enrollment</h1>
          <div className="student-info">
            <span id="student-id">ID: {studentInfo.id}</span>
            <span id="student-name">{studentInfo.name}</span>
            <span id="student-dept">Department: {studentInfo.dept}</span>
          </div>
        </div>
        <div className="enrollment-status">
          <div className="status-card">
            <h3>Current Academic Term</h3>
            <div className="status-info">
              <p>
                Academic Year:{" "}
                <span id="academic-year">{academicTerm.year}</span>
              </p>
              <p>
                Semester: <span id="semester">{academicTerm.semester}</span>
              </p>
              <p>
                Year Level:{" "}
                <span id="year-level">{academicTerm.yearLevel}</span>
              </p>
              <p>
                Enrollment Status:{" "}
                <span id="enrollment-status" className="status-pending">
                  {academicTerm.status}
                </span>
              </p>
            </div>
          </div>
          <div className="status-card">
            <h3>Enrollment Schedule</h3>
            <div className="status-info">
              <p>
                Regular Enrollment Period:{" "}
                <span id="regular-period">{enrollmentSchedule.regular}</span>
              </p>
              <p>
                Late Enrollment Period:{" "}
                <span id="late-period">{enrollmentSchedule.late}</span>
              </p>
              <p>
                Add/Drop Period:{" "}
                <span id="add-drop-period">{enrollmentSchedule.addDrop}</span>
              </p>
              <p>
                Classes Start:{" "}
                <span id="classes-start">
                  {enrollmentSchedule.classesStart}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="enrollment-action" id="enrollment-action-buttons">
          <button className="primary-btn" onClick={() => setShowForm(true)}>
            New Enrollment
          </button>
          <button className="secondary-btn" disabled>
            View Current Enrollment
          </button>
        </div>
        {showForm && (
          <div className="enrollment-form-container">
            <div className="form-header">
              <h2>Course Registration</h2>
              <p>
                Select subjects for Academic Year{" "}
                <span id="form-academic-year">{academicTerm.year}</span>,{" "}
                <span id="form-semester">{academicTerm.semester}</span> Semester
              </p>
            </div>
            <div className="curriculum-info">
              <h3>BSIT Curriculum - Year 2, 1st Semester</h3>
              <p>
                Select the subjects you want to enroll in. Please note
                prerequisite requirements.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Enrollment submitted!");
                setShowForm(false);
              }}
            >
              <div className="form-section">
                <h3>Available Subjects</h3>
                <div className="subject-list">
                  {subjects.map((subject) => (
                    <div className="subject-item" key={subject.id}>
                      <div className="subject-checkbox">
                        <input
                          type="checkbox"
                          id={`subject-${subject.id}`}
                          checked={!!selected[subject.id]}
                          onChange={(e) =>
                            handleCheckbox(subject.id, e.target.checked)
                          }
                        />
                      </div>
                      <div className="subject-info">
                        <label htmlFor={`subject-${subject.id}`}>
                          <span className="subject-code">{subject.code}</span>
                          <span className="subject-title">{subject.title}</span>
                          <span className="subject-units">{subject.units}</span>
                        </label>
                        <div className="subject-details">
                          <p>Prerequisites: {subject.prereq}</p>
                          <div className="section-select">
                            <label>Section:</label>
                            <select
                              title="Select section"
                              value={
                                selected[subject.id] || subject.sections[0]
                              }
                              onChange={(e) =>
                                handleSection(subject.id, e.target.value)
                              }
                              disabled={!selected[subject.id]}
                            >
                              {subject.sections.map((sec) => (
                                <option key={sec} value={sec}>
                                  {sec}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="enrollment-summary">
                <h3>Enrollment Summary</h3>
                <div className="summary-info">
                  <p>
                    Selected Subjects:{" "}
                    <span id="selected-count">{selectedSubjects.length}</span>
                  </p>
                  <p>
                    Total Units: <span id="total-units">{totalUnits}</span>
                  </p>
                  <p>
                    Estimated Tuition:{" "}
                    <span id="estimated-tuition">
                      ₱
                      {estimatedTuition.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  Submit Enrollment
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
