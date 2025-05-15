"use client";
import React, { useState } from "react";
import styles from "./user-registration.module.css";
import { supabase } from "@/lib/supabaseClient";
import ErrorMessage from "./components/ErrorMessage";
import Loading from "./components/Loading";
import { useAuth } from "@/lib/AuthContext";

const allUserTypes = [
  { id: "student", label: "Student" },
  { id: "teacher", label: "Teacher" },
  { id: "admin", label: "Administrator" },
] as const;

type UserType = (typeof allUserTypes)[number]["id"];

const initialFields = {
  student: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    username: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    program: "",
    yearLevel: "",
    section: "",
    guardianName: "",
    guardianContact: "",
  },
  teacher: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    username: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    department: "",
    position: "",
    employmentType: "",
    specialization: "",
  },
  admin: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    username: "",
    password: "",
    confirmPassword: "",
    adminId: "",
    adminRole: "",
    accessLevel: "",
    departmentAssignment: "",
  },
};

type Fields = typeof initialFields;

// Helper functions for ID generation
function generateStudentId(
  branch: string,
  year: number,
  deptCode: string,
  seq: number
) {
  const yearStr = String(year).slice(-2);
  const deptSeq = String(seq).padStart(4, "0");
  const sectionSeq = String(Math.floor(Math.random() * 900) + 100); // 3 digits
  return `${branch}${yearStr}-${deptSeq}-${sectionSeq}`;
}
function generateTeacherId(branch: string, year: number, seq: number) {
  return `t${year}-${String(seq).padStart(4, "0")}`;
}
function generateAdminId(branch: string, year: number, seq: number) {
  return `a${year}-${String(seq).padStart(4, "0")}`;
}

export default function UserRegistration() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isGlobalAdmin = userRole === "global-admin";
  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";
  let allowedTypes = [] as { id: UserType; label: string }[];
  if (isGlobalAdmin)
    allowedTypes = allUserTypes.filter((t) => t.id === "admin");
  else if (isAdmin)
    allowedTypes = allUserTypes.filter(
      (t) => t.id === "teacher" || t.id === "student"
    );
  else if (isTeacher)
    allowedTypes = allUserTypes.filter((t) => t.id === "student");
  // students and others: []

  const [userType, setUserType] = useState<UserType>("student");
  const [fields, setFields] = useState<Fields>(initialFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInput = (field: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [userType]: { ...prev[userType], [field]: value },
    }));
  };

  const handleUserType = (type: UserType) => {
    setUserType(type);
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const f = fields[userType];
    if (
      !f.firstName ||
      !f.lastName ||
      !f.email ||
      !f.username ||
      !f.password ||
      !f.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (f.password !== f.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    // Add more validation as needed
    return true;
  };

  // Helper for backend user creation
  async function createBackendUser(
    userType: UserType,
    meta: Record<string, unknown>
  ) {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meta, role: userType }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Backend user creation failed");
      }
      return true;
    } catch (err) {
      setError(
        "User created in Supabase, but backend user creation failed: " +
          (err as Error).message
      );
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      // Only allow registration if user has permission
      if (!allowedTypes.some((t) => t.id === userType)) {
        setError("You do not have permission to register this user type.");
        setLoading(false);
        return;
      }
      let meta = { ...fields[userType] };
      // ID generation/validation
      if (userType === "student") {
        const studentMeta = meta as (typeof initialFields)["student"];
        if (!studentMeta.studentId) {
          studentMeta.studentId = generateStudentId(
            "m",
            2025,
            studentMeta.program || "BSCS",
            Math.floor(Math.random() * 10000)
          );
        }
        meta = studentMeta;
      } else if (userType === "teacher") {
        const teacherMeta = meta as (typeof initialFields)["teacher"];
        if (!teacherMeta.employeeId) {
          teacherMeta.employeeId = generateTeacherId(
            "m",
            2025,
            Math.floor(Math.random() * 10000)
          );
        }
        meta = teacherMeta;
      } else if (userType === "admin") {
        const adminMeta = meta as (typeof initialFields)["admin"];
        if (!adminMeta.adminId) {
          adminMeta.adminId = generateAdminId(
            "m",
            2025,
            Math.floor(Math.random() * 10000)
          );
        }
        meta = adminMeta;
      }
      const { email, password, username, ...otherMeta } = meta;
      // 1. Register in Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...otherMeta,
            username,
            role: userType,
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // 2. Register in backend
      const backendOk = await createBackendUser(userType, {
        email,
        username,
        ...otherMeta,
      });
      if (backendOk) {
        setSuccess("User has been created successfully.");
      } else {
        setSuccess(
          "User created in Supabase, but backend user creation failed. Please contact IT."
        );
      }
      setFields(initialFields);
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationHeader}>
        <h1>User Registration</h1>
        <p>Create new user accounts for the School Enrollment System</p>
      </div>
      {success && <div className={styles.successMessage}>{success}</div>}
      {error && <ErrorMessage message={error} />}
      <div className={styles.userTypeTabs}>
        {allowedTypes.map((t) => (
          <button
            key={t.id}
            className={
              styles.userTypeTab +
              (userType === t.id ? " " + styles.userTypeTabActive : "")
            }
            onClick={() => handleUserType(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
      <form
        className={styles.registrationForm}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h3 className={styles.sectionHeading}>Basic Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">
              First Name <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="firstName"
              value={fields[userType].firstName}
              onChange={(e) => handleInput("firstName", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="middleName">Middle Name</label>
            <input
              id="middleName"
              value={fields[userType].middleName}
              onChange={(e) => handleInput("middleName", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">
              Last Name <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="lastName"
              value={fields[userType].lastName}
              onChange={(e) => handleInput("lastName", e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email Address <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={fields[userType].email}
              onChange={(e) => handleInput("email", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={fields[userType].phone}
              onChange={(e) => handleInput("phone", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">
              Date of Birth <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={fields[userType].dateOfBirth}
              onChange={(e) => handleInput("dateOfBirth", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">
              Gender <span className={styles.requiredAsterisk}>*</span>
            </label>
            <select
              id="gender"
              value={fields[userType].gender}
              onChange={(e) => handleInput("gender", e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nationality">Nationality</label>
            <input
              id="nationality"
              value={fields[userType].nationality}
              onChange={(e) => handleInput("nationality", e.target.value)}
            />
          </div>
        </div>
        <h3 className={styles.sectionHeading}>Account Security</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="username">
              Username <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="username"
              value={fields[userType].username}
              onChange={(e) => handleInput("username", e.target.value)}
              required
              minLength={5}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              Password <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="password"
              type="password"
              value={fields[userType].password}
              onChange={(e) => handleInput("password", e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              Confirm Password{" "}
              <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={fields[userType].confirmPassword}
              onChange={(e) => handleInput("confirmPassword", e.target.value)}
              required
            />
          </div>
        </div>
        {/* Conditional fields for each user type */}
        {userType === "student" && (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionHeading}>Student Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="studentId">Student ID</label>
                <input
                  id="studentId"
                  value={fields.student.studentId}
                  onChange={(e) => handleInput("studentId", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="program">Program/Course</label>
                <input
                  id="program"
                  value={fields.student.program}
                  onChange={(e) => handleInput("program", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="yearLevel">Year Level</label>
                <select
                  id="yearLevel"
                  value={fields.student.yearLevel}
                  onChange={(e) => handleInput("yearLevel", e.target.value)}
                >
                  <option value="">Select year level</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                  <option value="5">Fifth Year</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="section">Section</label>
                <input
                  id="section"
                  value={fields.student.section}
                  onChange={(e) => handleInput("section", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="guardianName">Guardian Name</label>
                <input
                  id="guardianName"
                  value={fields.student.guardianName}
                  onChange={(e) => handleInput("guardianName", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="guardianContact">Guardian Contact</label>
                <input
                  id="guardianContact"
                  value={fields.student.guardianContact}
                  onChange={(e) =>
                    handleInput("guardianContact", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
        {userType === "teacher" && (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionHeading}>Teacher Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  id="employeeId"
                  value={fields.teacher.employeeId}
                  onChange={(e) => handleInput("employeeId", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  value={fields.teacher.department}
                  onChange={(e) => handleInput("department", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="position">Position/Title</label>
                <input
                  id="position"
                  value={fields.teacher.position}
                  onChange={(e) => handleInput("position", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="employmentType">Employment Type</label>
                <select
                  id="employmentType"
                  value={fields.teacher.employmentType}
                  onChange={(e) =>
                    handleInput("employmentType", e.target.value)
                  }
                >
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="adjunct">Adjunct</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="specialization">
                  Specialization/Subject Area
                </label>
                <input
                  id="specialization"
                  value={fields.teacher.specialization}
                  onChange={(e) =>
                    handleInput("specialization", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
        {userType === "admin" && (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionHeading}>Administrator Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="adminId">Admin ID</label>
                <input
                  id="adminId"
                  value={fields.admin.adminId}
                  onChange={(e) => handleInput("adminId", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="adminRole">Administrative Role</label>
                <select
                  id="adminRole"
                  value={fields.admin.adminRole}
                  onChange={(e) => handleInput("adminRole", e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="system-admin">System Administrator</option>
                  <option value="registrar">Registrar</option>
                  <option value="finance">Finance Officer</option>
                  <option value="academic">Academic Officer</option>
                  <option value="admission">Admissions Officer</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="accessLevel">Access Level</label>
                <select
                  id="accessLevel"
                  value={fields.admin.accessLevel}
                  onChange={(e) => handleInput("accessLevel", e.target.value)}
                >
                  <option value="">Select access level</option>
                  <option value="1">Level 1 - Basic</option>
                  <option value="2">Level 2 - Intermediate</option>
                  <option value="3">Level 3 - Advanced</option>
                  <option value="4">Level 4 - Full Access</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="departmentAssignment">
                  Department Assignment
                </label>
                <input
                  id="departmentAssignment"
                  value={fields.admin.departmentAssignment}
                  onChange={(e) =>
                    handleInput("departmentAssignment", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
        <div className={styles.formActions}>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setFields(initialFields)}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Loading /> : "Register User"}
          </button>
        </div>
      </form>
    </div>
  );
}
