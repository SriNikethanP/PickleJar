import {
  AUTH_KEYS,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@lib/util/auth-persistence";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1";

class AdminApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = getLocalStorage(AUTH_KEYS.ADMIN.ACCESS_TOKEN);
    console.log("Admin API Client - Auth token check:", {
      token: token ? "Present" : "Missing",
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const refreshToken = getLocalStorage(AUTH_KEYS.ADMIN.REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalStorage(AUTH_KEYS.ADMIN.ACCESS_TOKEN, data.accessToken);
        setLocalStorage(AUTH_KEYS.ADMIN.REFRESH_TOKEN, data.refreshToken);
        setLocalStorage(AUTH_KEYS.ADMIN.USER_DATA, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Admin token refresh failed:", error);
      return false;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    console.log(`Admin API Request: ${options.method || "GET"} ${url}`);
    console.log("Request headers:", headers);

    let response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    console.log(
      `Admin API Response: ${response.status} ${response.statusText}`
    );

    // If 401, try to refresh token and retry once
    if (response.status === 401) {
      const refreshSuccess = await this.refreshTokenIfNeeded();
      if (refreshSuccess) {
        const newHeaders = await this.getAuthHeaders();
        response = await fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, try to get text content
        try {
          const textContent = await response.text();
          if (textContent) {
            errorMessage = `${errorMessage}: ${textContent}`;
          }
        } catch (textError) {
          // If we can't get text either, use default error message
        }
      }
      console.error(`Admin API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const adminApiClient = new AdminApiClient();
