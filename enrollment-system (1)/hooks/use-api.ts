"use client";

import { useState, useEffect } from "react";
import { ApiResponse, fetchWithAuth } from "@/lib/api";

/**
 * Custom hook for making API requests
 * 
 * @param endpoint - API endpoint to fetch from
 * @param options - Fetch options
 * @param dependencies - Array of dependencies to trigger refetch
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApi<T>(
  endpoint: string,
  options: RequestInit = {},
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<T> = await fetchWithAuth<T>(endpoint, options);
      
      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for making API requests with parameters
 * 
 * @param baseEndpoint - Base API endpoint
 * @param params - Object containing query parameters
 * @param options - Fetch options
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApiWithParams<T, P extends Record<string, any>>(
  baseEndpoint: string,
  params: P,
  options: RequestInit = {}
) {
  // Build query string from params
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  
  const endpoint = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
  
  // Use the base hook with the constructed endpoint
  return useApi<T>(endpoint, options, [JSON.stringify(params)]);
}
