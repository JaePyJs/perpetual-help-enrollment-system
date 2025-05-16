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
import apiClient from "@/lib/api-client";
import tokenService, { JwtPayload } from "@/services/token-service";

// Define the user type
interface User {
  id: string;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin" | "global-admin";
  firstName?: string;
  lastName?: string;
}

// JWT payload type is imported from token-service

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
        // Use token service to check if token is valid
        if (!tokenService.isTokenValid()) {
          // Token is invalid or expired, try to refresh
          const refreshed = await refreshToken();
          if (!refreshed) {
            setUser(null);
            setIsLoading(false);
            return;
          }
        }

        // Get user from token
        const userData = tokenService.getUserFromToken();
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
        tokenService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const refreshTokenValue = tokenService.getRefreshToken();

      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      // Use the API client to refresh the token
      const data = await apiClient.post("/auth/refresh", {
        refreshToken: refreshTokenValue,
      });

      // Store tokens using token service
      tokenService.setAccessToken(data.token);

      if (data.refreshToken) {
        tokenService.setRefreshToken(data.refreshToken);
      }

      // Get user from token
      const userData = tokenService.getUserFromToken();
      if (userData) {
        setUser(userData);
      }

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      setUser(null);
      tokenService.clearTokens();
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
      // For testing purposes, we'll still support the hardcoded credentials
      // This allows testing without a backend connection
      const validCredentials = {
        student: { username: "student@uphc.edu.ph", password: "student123" },
        teacher: { username: "teacher@uphc.edu.ph", password: "teacher123" },
        admin: { username: "admin@uphc.edu.ph", password: "admin123" },
        "global-admin": {
          username: "global-admin@uphc.edu.ph",
          password: "admin123",
        },
      };

      // Check if using test credentials
      const roleCredentials = validCredentials[role];
      if (
        username === roleCredentials.username &&
        password === roleCredentials.password
      ) {
        // Create a mock user object for test credentials
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

        // Create a mock token for test credentials
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

        // Store tokens using token service
        tokenService.setAccessToken(mockToken);
        tokenService.setRefreshToken("mock-refresh-token");

        setUser(userData);

        // Redirect to the appropriate dashboard
        if (userData.role === "global-admin") {
          tokenService.setGlobalAdmin(true);
          router.push("/admin/dashboard");
        } else {
          tokenService.setGlobalAdmin(false);
          router.push(`/${userData.role}/dashboard`);
        }
        return;
      }

      // If not using test credentials, try the real backend API using our API client
      const data = await apiClient.post("/auth/login", {
        username,
        password,
        role,
      });

      // Store tokens using token service
      tokenService.setAccessToken(data.token);

      if (data.refreshToken) {
        tokenService.setRefreshToken(data.refreshToken);
      }

      // Get user from token
      const userData = tokenService.getUserFromToken();
      if (!userData) {
        throw new Error("Failed to decode user data from token");
      }

      setUser(userData);

      // Redirect to the appropriate dashboard
      if (userData.role === "global-admin") {
        tokenService.setGlobalAdmin(true);
        router.push("/admin/dashboard");
      } else {
        tokenService.setGlobalAdmin(false);
        router.push(`/${userData.role}/dashboard`);
      }
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
    tokenService.clearTokens();
    router.push("/auth/login");
  };

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);

    try {
      // Use the API client to register
      return await apiClient.post("/auth/register", userData);
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
      // Use the API client to send a password reset email
      return await apiClient.post("/auth/forgot-password", { email });
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
      // Use the API client to reset the password
      return await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
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

  // Check if there's a global-admin flag using token service
  // This ensures that even if the user object doesn't have the correct role,
  // we can still identify global-admin users
  if (context.user && typeof window !== "undefined") {
    const isGlobalAdmin = tokenService.isGlobalAdmin();
    if (isGlobalAdmin && context.user.role === "admin") {
      // Override the role to global-admin if the flag is set
      context.user = {
        ...context.user,
        role: "global-admin",
      };
    }
  }

  return context;
}
