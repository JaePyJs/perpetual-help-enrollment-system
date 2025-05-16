"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Define the user type
interface User {
  id: string;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin" | "global-admin";
  firstName?: string;
  lastName?: string;
}

// Define the JWT payload type
interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin" | "global-admin";
  firstName?: string;
  lastName?: string;
  exp: number;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
    role: "student" | "teacher" | "admin" | "global-admin"
  ) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          // Try to decode the token
          const decoded = jwtDecode<JwtPayload>(accessToken);

          // Check if the token is expired
          if (decoded.exp * 1000 < Date.now()) {
            // Token is expired, try to refresh
            await refreshToken();
          } else {
            // Token is valid, set the user
            setUser({
              id: decoded.sub,
              username: decoded.username || decoded.sub,
              email: decoded.email,
              role: decoded.role,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
            });
          }
        } catch (decodeError) {
          // If jwtDecode fails, try to parse the token as a base64 encoded JSON
          try {
            const decodedJson = JSON.parse(atob(accessToken));
            setUser({
              id: decodedJson.sub,
              username: decodedJson.username || decodedJson.sub,
              email: decodedJson.email,
              role: decodedJson.role,
              firstName: decodedJson.firstName,
              lastName: decodedJson.lastName,
            });
          } catch (parseError) {
            // If both methods fail, clear the tokens
            console.error("Token parsing error:", parseError);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");

      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Call the real backend API to refresh the token
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.token);

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Decode the new token
      const decoded = jwtDecode<JwtPayload>(data.token);

      setUser({
        id: decoded.sub,
        username: decoded.username || decoded.sub,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      });

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  };

  // Login function
  const login = async (
    username: string,
    password: string,
    role: "student" | "teacher" | "admin" | "global-admin"
  ) => {
    setIsLoading(true);

    try {
      // For demonstration purposes, we'll use hardcoded credentials
      // This simulates a successful login without needing the backend
      const validCredentials = {
        student: { username: "student@uphc.edu.ph", password: "student123" },
        teacher: { username: "teacher@uphc.edu.ph", password: "teacher123" },
        admin: { username: "admin@uphc.edu.ph", password: "admin123" },
        "global-admin": {
          username: "global-admin@uphc.edu.ph",
          password: "admin123",
        },
      };

      // Check if the credentials match
      const roleCredentials = validCredentials[role];
      if (
        username === roleCredentials.username &&
        password === roleCredentials.password
      ) {
        // Create a mock user object
        const userData = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          username: username,
          email: username,
          role: role,
          firstName:
            role === "admin"
              ? "Jam"
              : role.charAt(0).toUpperCase() + role.slice(1),
          lastName: role === "admin" ? "Agoo" : "User",
        };

        // Create a mock token (in a real app, this would come from the backend)
        const mockToken = btoa(
          JSON.stringify({
            sub: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          })
        );

        // Store tokens in localStorage
        localStorage.setItem("accessToken", mockToken);
        localStorage.setItem("refreshToken", "mock-refresh-token");

        setUser(userData);

        // Redirect to the appropriate dashboard
        router.push(`/${userData.role}/dashboard`);
        return;
      }

      // If we get here, the credentials didn't match
      throw new Error("Invalid credentials");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Call the real backend API to register
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Call the real backend API to send a password reset email
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to send password reset email"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Call the real backend API to reset the password
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
