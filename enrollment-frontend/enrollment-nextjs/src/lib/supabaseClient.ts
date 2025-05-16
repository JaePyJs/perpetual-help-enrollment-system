// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Create a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (
  error: { message?: string } | Error | unknown
) => {
  const message =
    typeof error === "object" && error && "message" in error
      ? (error as { message?: string }).message
      : "An unknown error occurred";
  console.error("Supabase Error:", message);
  return { error: message };
};

// Type definitions for common Supabase operations
export type SupabaseResponse<T> = {
  data: T | null;
  error: string | null;
};
