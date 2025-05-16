"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute Component
 *
 * A wrapper component that protects routes by:
 * 1. Checking if the user is authenticated
 * 2. Optionally checking if the user has the required role(s)
 * 3. Redirecting to login if not authenticated
 * 4. Showing an access denied message if authenticated but wrong role
 *
 * @param children - The components to render if access is granted
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading size="large" message="Checking authentication..." />;
  }

  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If roles are specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.user_metadata?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div className="access-denied">
          <div className="card p-8 max-w-md mx-auto text-center">
            <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="mb-6">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn btn-primary"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
}
