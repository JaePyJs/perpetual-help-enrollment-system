// src/app/components/ModernLoginForm.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School,
  Person,
  AdminPanelSettings,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { supabase } from "@/lib/supabaseClient";

const RoleTab = styled(Tab)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1rem",
  textTransform: "none",
  minHeight: "48px",
  borderRadius: theme.shape.borderRadius,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  width: "100%",
  maxWidth: "900px",
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3, width: "100%" }}>{children}</Box>}
    </div>
  );
}

type Role = "student" | "teacher" | "admin";

const roles = [
  { id: "student", label: "Student", icon: <School /> },
  { id: "teacher", label: "Teacher", icon: <Person /> },
  { id: "admin", label: "Admin", icon: <AdminPanelSettings /> },
] as const;

export default function ModernLoginForm() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState({
    student: { email: "", password: "" },
    teacher: { email: "", password: "" },
    admin: { email: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState({
    student: false,
    teacher: false,
    admin: false,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
    setError("");
  };

  const handleInput = (
    role: Role,
    field: "email" | "password",
    value: string
  ) => {
    setFields((f) => ({ ...f, [role]: { ...f[role], [field]: value } }));
  };

  const togglePasswordVisibility = (role: Role) => {
    setShowPassword((s) => ({ ...s, [role]: !s[role] }));
  };

  const handleLogin = async (e: React.FormEvent, role: Role) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const usernameOrId = fields[role].email.trim();
    const password = fields[role].password;

    // If the input looks like an ID (e.g., m23-1470-578), try to resolve to email
    let email = usernameOrId;
    if (/^[a-z]\d{2}-\d{4}-\d{3}$/i.test(usernameOrId)) {
      // For student IDs, we can directly construct the email
      if (role === "student") {
        email = `${usernameOrId}@manila.uphsl.edu.ph`;
      } else {
        // For other roles, we need to look up the email
        const idField = role === "teacher" ? "employeeId" : "adminId";
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
    }

    // Form validation
    if (!email || !password) {
      setError("Please enter both username/ID and password");
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

  return (
    <StyledCard>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
        }}
      >
        {/* Left panel - school branding */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: { md: "40%" },
          }}
        >
          <Box
            component="img"
            src="/images/school-logo.png"
            alt="Perpetual Help College Logo"
            sx={{
              width: { xs: 120, md: 180 },
              height: "auto",
              mb: 4,
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Perpetual Help College
          </Typography>
          <Typography variant="h6" align="center">
            Enrollment System
          </Typography>
        </Box>

        {/* Right panel - login form */}
        <Box sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Log In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={activeTabIndex}
            onChange={handleTabChange}
            aria-label="login tabs"
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
            }}
          >
            {roles.map((role, index) => (
              <RoleTab
                key={role.id}
                icon={role.icon}
                label={role.label}
                id={`login-tab-${index}`}
                aria-controls={`login-tabpanel-${index}`}
              />
            ))}
          </Tabs>

          {roles.map((role, index) => (
            <TabPanel key={role.id} value={activeTabIndex} index={index}>
              <Box
                component="form"
                onSubmit={(e) => handleLogin(e, role.id)}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id={`${role.id}-email`}
                  label={`${role.label} ID or Email`}
                  name="email"
                  autoComplete="username"
                  autoFocus={index === activeTabIndex}
                  value={fields[role.id].email}
                  onChange={(e) =>
                    handleInput(role.id, "email", e.target.value)
                  }
                  placeholder={
                    role.id === "student"
                      ? "m23-1470-578 or m23-1470-578@manila.uphsl.edu.ph"
                      : ""
                  }
                  helperText={
                    role.id === "student"
                      ? "Enter your student ID or full email address"
                      : ""
                  }
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword[role.id] ? "text" : "password"}
                  id={`${role.id}-password`}
                  autoComplete="current-password"
                  value={fields[role.id].password}
                  onChange={(e) =>
                    handleInput(role.id, "password", e.target.value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility(role.id)}
                          edge="end"
                        >
                          {showPassword[role.id] ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Button
                    href="https://docs.google.com/forms/d/e/1FAIpQLSczJVOOdAV0IUG6nx72DVPbU2WPKyQbdYrM2lzHb_v01Ra8OQ/viewform"
                    target="_blank"
                    sx={{ textTransform: "none" }}
                  >
                    Forgot Username/Password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mt: 2,
                    mb: 2,
                    fontSize: "1rem",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </Box>
            </TabPanel>
          ))}
        </Box>
      </Box>
    </StyledCard>
  );
}
