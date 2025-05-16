import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: "student" | "teacher" | "admin";
  exp: number;
}

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Get the referrer to check if coming from Table of Contents
  const referrer = request.headers.get("referer") || "";
  const isFromTableOfContents = referrer.includes("/table-of-contents");

  // For demonstration purposes, allow access to all pages
  // This will prevent redirects to login when clicking dashboard links
  return NextResponse.next();

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/forgot-password" ||
    path === "/auth/reset-password" ||
    path === "/table-of-contents" ||
    path === "/";

  // Get the token from the request headers (will be set by the client from localStorage)
  // Note: In server components/middleware, we can't directly access localStorage
  // Instead, the token will be sent in the Authorization header by the client
  const authHeader = request.headers.get("Authorization");
  const token = authHeader ? authHeader.replace("Bearer ", "") : null;

  // If the path is public and the user is authenticated, redirect to the dashboard
  if (isPublicPath && token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        // Token is expired, let them access the public path
        return NextResponse.next();
      }

      // Token is valid, redirect to the appropriate dashboard
      return NextResponse.redirect(
        new URL(`/${decoded.role}/dashboard`, request.url)
      );
    } catch (error) {
      // Invalid token, let them access the public path
      return NextResponse.next();
    }
  }

  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the path is not public and the user is authenticated, check role-based access
  if (!isPublicPath && token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        // Token is expired, redirect to login
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      // Check if the user is accessing a path for their role
      const roleFromPath = path.split("/")[1]; // e.g., "student" from "/student/dashboard"

      // Special case for global-admin: allow access to admin paths
      if (decoded.role === "global-admin" && roleFromPath === "admin") {
        // Global admin can access admin paths
        return NextResponse.next();
      }

      if (roleFromPath !== decoded.role) {
        // User is trying to access a path for a different role, redirect to their dashboard
        return NextResponse.redirect(
          new URL(`/${decoded.role}/dashboard`, request.url)
        );
      }

      // User is accessing a path for their role, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Default: allow access
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/auth/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/table-of-contents",
  ],
};
