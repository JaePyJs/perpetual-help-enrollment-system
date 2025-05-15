"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const roleTabs = [
  {
    id: "student",
    label: "Student",
    icon: (
      <span role="img" aria-label="Student">
        🎓
      </span>
    ),
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: (
      <span role="img" aria-label="Teacher">
        👨‍🏫
      </span>
    ),
  },
  {
    id: "admin",
    label: "Admin",
    icon: (
      <span role="img" aria-label="Admin">
        🛡️
      </span>
    ),
  },
] as const;

type Role = (typeof roleTabs)[number]["id"];

type Fields = {
  student: { email: string; password: string };
  teacher: { email: string; password: string };
  admin: { email: string; password: string };
};

type ShowPassword = {
  student: boolean;
  teacher: boolean;
  admin: boolean;
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Role>("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    student: false,
    teacher: false,
    admin: false,
  });
  const [fields, setFields] = useState<Fields>({
    student: { email: "", password: "" },
    teacher: { email: "", password: "" },
    admin: { email: "", password: "" },
  });

  // Keyboard navigation for tabs
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab" && e.altKey) {
        e.preventDefault();
        const idx = roleTabs.findIndex((t) => t.id === activeTab);
        setActiveTab(roleTabs[(idx + 1) % roleTabs.length].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTab]);

  // Handle input changes
  const handleInput = (
    role: Role,
    field: "email" | "password",
    value: string
  ) => {
    setFields((f) => ({ ...f, [role]: { ...f[role], [field]: value } }));
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent, role: Role) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const usernameOrId = fields[role].email.trim();
    const password = fields[role].password;

    // If the input looks like an ID (e.g., m23-1470-578), try to resolve to email
    let email = usernameOrId;
    if (/^[a-z]\d{2}-\d{4}-\d{3}$/i.test(usernameOrId)) {
      const idField =
        role === "student"
          ? "studentId"
          : role === "teacher"
          ? "employeeId"
          : "adminId";
      const { data, error: fetchError } = await supabase
        .from(role + "s")
        .select("email")
        .eq(idField, usernameOrId)
        .single();
      if (fetchError || !data?.email) {
        setError("No account found for this ID number.");
        setLoading(false);
        return;
      }
      email = data.email;
    }

    // Form validation
    if (!email || !password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      // Supabase Auth logic with role-specific metadata
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      // Check if the user has the correct role
      const userData = data.user?.user_metadata;
      const userRole = userData?.role || role;

      if (userRole !== role) {
        setError(
          `This account doesn't have ${role} privileges. Please use the correct login tab.`
        );
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Redirect logic (customize per role)
      if (role === "student") window.location.href = "/student-dashboard";
      else if (role === "teacher") window.location.href = "/teacher-dashboard";
      else if (role === "admin") window.location.href = "/admin-dashboard";
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Image switching logic
  const getActiveImage = () => {
    if (activeTab === "student") return "/images/students.png";
    if (activeTab === "teacher") return "/images/teacher.png";
    return "/images/admin.png";
  };

  return (
    <main>
      <div className="wrapper">
        <div className="container">
          <div className="left-panel">
            <div className="image-text-wrapper">
              <div className="image-container student-theme">
                <Image
                  src={getActiveImage()}
                  alt={`${
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                  } Portal`}
                  width={180}
                  height={180}
                  className="role-image active"
                  priority
                />
              </div>
              <div className="welcome-message">
                <h2>
                  <b>Welcome to Perpetual!</b>
                </h2>
              </div>
            </div>
          </div>
          <div className="right-panel">
            {error && (
              <div id="error-message" className="error-message">
                {error}
              </div>
            )}
            <div className="nav-tabs" role="tablist">
              {roleTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-link${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError("");
                  }}
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id ? "true" : "false"}
                  tabIndex={0}
                  type="button"
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                  <span className="sr-only">Login</span>
                </button>
              ))}
            </div>
            {roleTabs.map((tab) => (
              <form
                key={tab.id}
                id={tab.id}
                className={`tab-content${
                  activeTab === tab.id ? " active" : ""
                }`}
                onSubmit={(e) => handleLogin(e, tab.id)}
                autoComplete="off"
              >
                <h3 className={`${tab.id}-login-heading`}>
                  <span className="tab-icon" aria-hidden="true">
                    {tab.icon}
                  </span>{" "}
                  {tab.label} Log in
                </h3>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder={
                      tab.id === "student" ? "User" : tab.label + " ID"
                    }
                    value={fields[tab.id].email}
                    onChange={(e) =>
                      handleInput(tab.id, "email", e.target.value)
                    }
                    required
                    autoComplete="username"
                    aria-label={tab.label + " username"}
                    className="input"
                  />
                </div>
                <div className="input-group password-group">
                  <input
                    type={showPassword[tab.id] ? "text" : "password"}
                    placeholder="Password"
                    className="input password-input"
                    value={fields[tab.id].password}
                    onChange={(e) =>
                      handleInput(tab.id, "password", e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    aria-label={tab.label + " password"}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword[tab.id] ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((s: ShowPassword) => ({
                        ...s,
                        [tab.id]: !s[tab.id],
                      }))
                    }
                    tabIndex={0}
                  >
                    {showPassword[tab.id] ? (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 1l22 22M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.05 0-9.29-3.14-11-7 1.21-2.73 3.29-5 6-6.32M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33" />
                        <path d="M12 5c7.18 0 13 7 13 7s-2.82 3.5-7 5.5" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <ellipse cx="12" cy="12" rx="10" ry="7" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="actions">
                  <Link
                    className="forgot"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSczJVOOdAV0IUG6nx72DVPbU2WPKyQbdYrM2lzHb_v01Ra8OQ/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forgot Username or Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className={`continue btn${loading ? " loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner" aria-label="Loading"></span>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 1.5em;
          height: 1.5em;
          border: 3px solid #e77f33;
          border-radius: 50%;
          border-top: 3px solid #fff;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .input:focus {
          border-color: #e77f33;
          box-shadow: 0 0 0 2px rgba(231, 127, 51, 0.15);
        }
        .tab-link.active {
          border-bottom: 3px solid #e77f33;
          color: #e77f33;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
