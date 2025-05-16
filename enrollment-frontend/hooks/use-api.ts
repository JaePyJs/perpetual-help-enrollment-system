"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient, { ApiError } from "@/lib/api-client";

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError | Error) => void;
  dependencies?: any[];
  skipInitialFetch?: boolean;
}

/**
 * Custom hook for data fetching with loading and error states
 * @param endpoint API endpoint to fetch data from
 * @param options Configuration options
 * @returns Object with data, loading, error, and refetch function
 */
export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions<T> = {},
  requestOptions: RequestInit = {}
) {
  const {
    initialData,
    onSuccess,
    onError,
    dependencies = [],
    skipInitialFetch = false,
  } = options;

  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(!skipInitialFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setData(null);
      if (onError)
        onError(err instanceof ApiError ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData().catch((err) =>
        console.error(`Error fetching ${endpoint}:`, err)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, skipInitialFetch, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for making API requests with parameters
 *
 * @param baseEndpoint - Base API endpoint
 * @param params - Object containing query parameters
 * @param options - API options
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApiWithParams<T, P extends Record<string, any>>(
  baseEndpoint: string,
  params: P,
  options: UseApiOptions<T> = {}
) {
  // Build query string from params
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  const endpoint = queryString
    ? `${baseEndpoint}?${queryString}`
    : baseEndpoint;

  // Use the base hook with the constructed endpoint
  return useApi<T>(endpoint, {
    ...options,
    dependencies: [...(options.dependencies || []), JSON.stringify(params)],
  });
}

/**
 * Custom hook for data mutation (POST, PUT, PATCH, DELETE)
 * @param method HTTP method to use
 * @param endpoint API endpoint to send data to
 * @param options Configuration options
 * @returns Object with mutate function, loading, and error states
 */
export function useApiMutation<T = any, D = any>(
  method: "post" | "put" | "patch" | "delete",
  endpoint: string,
  options: Omit<UseApiOptions<T>, "skipInitialFetch"> = {}
) {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (mutationData?: D) => {
      setLoading(true);
      setError(null);

      try {
        let result;

        if (method === "delete") {
          result = await apiClient.delete<T>(endpoint);
        } else {
          result = await apiClient[method]<T>(endpoint, mutationData);
        }

        setData(result);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        if (onError)
          onError(err instanceof ApiError ? err : new Error(errorMessage));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [method, endpoint, onSuccess, onError]
  );

  return { mutate, data, loading, error };
}
