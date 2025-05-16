/**
 * API Client
 *
 * This module provides a consistent way to interact with the backend API.
 * It handles authentication, error handling, and response parsing.
 */

// Base API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Default request options
const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies in requests
};

// Error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Import token service
import tokenService from "@/services/token-service";

// Function to get the authentication token
const getAuthToken = (): string | null => {
  return tokenService.getAccessToken();
};

// Function to add authentication headers to request options
const addAuthHeaders = (options: RequestInit): RequestInit => {
  const token = getAuthToken();
  if (!token) return options;

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

// Function to handle API responses
const handleResponse = async (response: Response) => {
  // Check if the response is JSON
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  // Parse the response data
  const data = isJson ? await response.json() : await response.text();

  // If the response is not ok, throw an error
  if (!response.ok) {
    const message = isJson && data.message ? data.message : "An error occurred";
    throw new ApiError(message, response.status, data);
  }

  return data;
};

// API client functions
export const apiClient = {
  /**
   * Send a GET request to the API
   * @param endpoint - API endpoint (without the base URL)
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = addAuthHeaders({
      ...defaultOptions,
      ...options,
      method: "GET",
    });

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },

  /**
   * Send a POST request to the API
   * @param endpoint - API endpoint (without the base URL)
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async post<T = any>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = addAuthHeaders({
      ...defaultOptions,
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },

  /**
   * Send a PUT request to the API
   * @param endpoint - API endpoint (without the base URL)
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async put<T = any>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = addAuthHeaders({
      ...defaultOptions,
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },

  /**
   * Send a PATCH request to the API
   * @param endpoint - API endpoint (without the base URL)
   * @param data - Request body data
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async patch<T = any>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = addAuthHeaders({
      ...defaultOptions,
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },

  /**
   * Send a DELETE request to the API
   * @param endpoint - API endpoint (without the base URL)
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async delete<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = addAuthHeaders({
      ...defaultOptions,
      ...options,
      method: "DELETE",
    });

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },
};

export default apiClient;
