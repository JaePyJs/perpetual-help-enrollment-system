/**
 * Token Service
 * 
 * This module provides functions for managing authentication tokens.
 * It centralizes token storage and retrieval to ensure consistency across the application.
 */

import { jwtDecode } from "jwt-decode";

// Define the JWT payload type
export interface JwtPayload {
  sub: string;
  username?: string;
  email?: string;
  role: "student" | "teacher" | "admin" | "global-admin";
  firstName?: string;
  lastName?: string;
  exp: number;
}

// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const GLOBAL_ADMIN_KEY = "isGlobalAdmin";

/**
 * Get the access token from storage
 * @returns The access token or null if not found
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Set the access token in storage
 * @param token The access token to store
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Get the refresh token from storage
 * @returns The refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set the refresh token in storage
 * @param token The refresh token to store
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Remove all tokens from storage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(GLOBAL_ADMIN_KEY);
}

/**
 * Check if the access token is valid
 * @returns True if the token is valid, false otherwise
 */
export function isTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
}

/**
 * Get the user information from the access token
 * @returns The user information or null if the token is invalid
 */
export function getUserFromToken(): {
  id: string;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin" | "global-admin";
  firstName?: string;
  lastName?: string;
} | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    
    // Check if there's a global-admin flag in localStorage
    const isGlobalAdmin = localStorage.getItem(GLOBAL_ADMIN_KEY) === "true";
    const role = isGlobalAdmin && decoded.role === "admin" ? "global-admin" : decoded.role;
    
    return {
      id: decoded.sub,
      username: decoded.username || decoded.sub,
      email: decoded.email || "",
      role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Set the global admin flag
 * @param isGlobalAdmin Whether the user is a global admin
 */
export function setGlobalAdmin(isGlobalAdmin: boolean): void {
  if (typeof window === "undefined") return;
  if (isGlobalAdmin) {
    localStorage.setItem(GLOBAL_ADMIN_KEY, "true");
  } else {
    localStorage.removeItem(GLOBAL_ADMIN_KEY);
  }
}

/**
 * Check if the user is a global admin
 * @returns True if the user is a global admin, false otherwise
 */
export function isGlobalAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GLOBAL_ADMIN_KEY) === "true";
}

export default {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  isTokenValid,
  getUserFromToken,
  setGlobalAdmin,
  isGlobalAdmin,
};
