"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "teacher" | "admin" | "global-admin")[];
}

/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication.
 * It can also restrict access based on user roles.
 * 
 * @param children - The content to render if the user is authenticated
 * @param allowedRoles - Optional array of roles that are allowed to access the route
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for authentication to complete
    if (!isLoading) {
      // Check if the user is authenticated
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push("/auth/login");
        return;
      }

      // Check if the user has the required role
      if (allowedRoles && user) {
        // Special case for global-admin: they can access admin routes
        if (user.role === "global-admin" && allowedRoles.includes("admin")) {
          setIsAuthorized(true);
        } else if (allowedRoles.includes(user.role)) {
          setIsAuthorized(true);
        } else {
          // Redirect to the user's dashboard if they don't have the required role
          router.push(`/${user.role}/dashboard`);
        }
      } else {
        // If no roles are specified, any authenticated user can access the route
        setIsAuthorized(true);
      }

      setIsCheckingAuth(false);
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading size="large" text="Checking authentication..." />
      </div>
    );
  }

  // Render children if the user is authorized
  return isAuthorized ? <>{children}</> : null;
}

/**
 * Student Route Component
 * 
 * This component protects routes that require student role.
 * 
 * @param children - The content to render if the user is a student
 */
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Teacher Route Component
 * 
 * This component protects routes that require teacher role.
 * 
 * @param children - The content to render if the user is a teacher
 */
export function TeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Admin Route Component
 * 
 * This component protects routes that require admin role.
 * Global admins can also access these routes.
 * 
 * @param children - The content to render if the user is an admin
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "global-admin"]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Global Admin Route Component
 * 
 * This component protects routes that require global admin role.
 * 
 * @param children - The content to render if the user is a global admin
 */
export function GlobalAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["global-admin"]}>
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;
