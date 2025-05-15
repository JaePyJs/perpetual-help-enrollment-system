"use client";
import React from "react";
import { Box, Container } from "@mui/material";
import ModernLoginForm from "./components/ModernLoginForm";

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
      const idField = role === "student" ? "studentId" : role === "teacher" ? "employeeId" : "adminId";
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
    <ThemeProvider>
      <ThemeSwitcher />
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
                  aria-selected={activeTab === tab.id ? true : false}
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
              >
                <h3 className={`${tab.id}-login-heading`}>
                  {tab.icon} {tab.label} Log in
                </h3>
                <input
                  type="text"
                  placeholder={
                    tab.id === "student" ? "User" : tab.label + " ID"
                  }
                  value={fields[tab.id].email}
                  onChange={(e) => handleInput(tab.id, "email", e.target.value)}
                  required
                  autoComplete="username"
                  aria-label={tab.label + " username"}
                />
                <input
                  type={showPassword[tab.id] ? "text" : "password"}
                  placeholder="Password"
                  className="password-input"
                  value={fields[tab.id].password}
                  onChange={(e) =>
                    handleInput(tab.id, "password", e.target.value)
                  }
                  required
                  autoComplete="current-password"
                  aria-label={tab.label + " password"}
                />
                <div className="actions">
                  <Link
                    className="forgot"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSczJVOOdAV0IUG6nx72DVPbU2WPKyQbdYrM2lzHb_v01Ra8OQ/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forgot Username or Password?
                  </Link>
                  <button
                    type="button"
                    className={`show-password${
                      showPassword[tab.id] ? " active" : ""
                    }`}
                    onClick={() =>
                      setShowPassword((s) => ({ ...s, [tab.id]: !s[tab.id] }))
                    }
                    aria-pressed={showPassword[tab.id] ? "true" : "false"}
                  >
                    {showPassword[tab.id] ? "Hide" : "Show"}
                  </button>
                </div>
                <button
                  type="submit"
                  className={`continue${loading ? " loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Continue"}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
