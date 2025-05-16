import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a student email address based on the student's name and department
 * Format: m23-1470-578@manila.uphsl.edu.ph
 *
 * @param name The student's full name
 * @param department The student's department code (e.g., BSCS, BSIT)
 * @returns A student email address
 */
export function generateStudentEmail(name: string, department: string): string {
  // Generate a random 4-digit number for the first part
  const firstPart = Math.floor(1000 + Math.random() * 9000);

  // Generate a random 3-digit number for the second part
  const secondPart = Math.floor(100 + Math.random() * 900);

  // Get the current year's last two digits
  const year = new Date().getFullYear().toString().slice(2);

  // Format: m23-1470-578@manila.uphsl.edu.ph
  return `m${year}-${firstPart}-${secondPart}@manila.uphsl.edu.ph`;
}

/**
 * Generates a student ID following the format m23-1470-578
 *
 * @returns A student ID
 */
export function generateStudentId(): string {
  // Generate a random 4-digit number for the first part
  const firstPart = Math.floor(1000 + Math.random() * 9000);

  // Generate a random 3-digit number for the second part
  const secondPart = Math.floor(100 + Math.random() * 900);

  // Get the current year's last two digits
  const year = new Date().getFullYear().toString().slice(2);

  // Format: m23-1470-578
  return `m${year}-${firstPart}-${secondPart}`;
}

/**
 * Generates a teacher ID following the format T-2023-xxxx
 *
 * @returns A teacher ID
 */
export function generateTeacherId(): string {
  // Generate a random 4-digit number
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  // Get the current year
  const year = new Date().getFullYear();

  // Format: T-2023-xxxx
  return `T-${year}-${randomPart}`;
}

/**
 * Generates an admin ID following the format A-2023-xxxx
 *
 * @param isGlobalAdmin Whether the admin is a global admin
 * @returns An admin ID
 */
export function generateAdminId(isGlobalAdmin: boolean = false): string {
  // Generate a random 4-digit number
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  // Get the current year
  const year = new Date().getFullYear();

  // Format: A-2023-xxxx or GA-2023-xxxx
  const prefix = isGlobalAdmin ? "GA" : "A";
  return `${prefix}-${year}-${randomPart}`;
}

/**
 * Generates a unique ID for a user
 *
 * @param role The user's role (student, teacher, admin, global-admin)
 * @returns A unique ID
 */
export function generateUserId(role: string): string {
  if (role === "student") {
    return generateStudentId();
  } else if (role === "teacher") {
    return generateTeacherId();
  } else if (role === "admin") {
    return generateAdminId(false);
  } else if (role === "global-admin") {
    return generateAdminId(true);
  }

  // Fallback to generic ID if role is not recognized
  const prefix = role.charAt(0).toUpperCase(); // S for student, T for teacher, etc.
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString(36).substring(4).toUpperCase();

  return `${prefix}${randomPart}${timestamp}`;
}

/**
 * Formats a date string to a more readable format
 *
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Generates a random password that meets the requirements
 *
 * @returns A random password
 */
export function generateRandomPassword(): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*()_+=-";

  let password = "";

  // Add at least one character from each category
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  // Add more random characters to reach the desired length (12)
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 0; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
