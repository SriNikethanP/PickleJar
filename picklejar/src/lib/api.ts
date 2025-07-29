const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1";

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem("accessToken");
    console.log("API Client - Auth token check:", {
      token: token ? "Present" : "Missing",
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
    });
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
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
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    console.log(
      `API Client - Making ${options.method || "GET"} request to: ${url}`
    );
    console.log("API Client - Request headers:", headers);
    if (options.body) {
      console.log("API Client - Request body:", options.body);
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    console.log(`API Client - Response status: ${response.status}`);
    console.log(
      "API Client - Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // If 401, try to refresh token and retry once
    if (response.status === 401) {
      console.log("API Client - 401 received, attempting token refresh");
      const refreshSuccess = await this.refreshTokenIfNeeded();
      if (refreshSuccess) {
        console.log("API Client - Token refresh successful, retrying request");
        const newHeaders = await this.getAuthHeaders();
        response = await fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
        console.log(`API Client - Retry response status: ${response.status}`);
      } else {
        console.log("API Client - Token refresh failed");
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      // Provide more specific error messages based on status code
      switch (response.status) {
        case 401:
          errorMessage = "Authentication required. Please log in.";
          break;
        case 403:
          errorMessage =
            "Access denied. You don't have permission to perform this action.";
          break;
        case 404:
          errorMessage = "Resource not found.";
          break;
        case 500:
          errorMessage = "Internal server error. Please try again later.";
          break;
        default:
          errorMessage = `HTTP error! status: ${response.status}`;
      }

      try {
        const errorData = await response.json();
        console.log("API Client - Error response JSON:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.log(
          "API Client - Failed to parse error response as JSON:",
          parseError
        );
        // If response is not JSON, try to get text content
        try {
          const textContent = await response.text();
          console.log("API Client - Error response text:", textContent);
          if (textContent && textContent.trim()) {
            errorMessage = textContent;
          }
        } catch (textError) {
          console.log(
            "API Client - Failed to get error response text:",
            textError
          );
          // If all else fails, use the default error message
        }
      }
      console.log("API Client - Final error message:", errorMessage);
      throw new Error(errorMessage);
    }

    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    console.log("API Client - Response headers:", {
      contentType,
      contentLength,
      status: response.status,
      statusText: response.statusText,
    });

    // If response is empty or has no content, return null
    if (
      contentLength === "0" ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      console.log("API Client - Returning null for empty/non-JSON response");
      return null;
    }

    try {
      const jsonData = await response.json();
      console.log("API Client - Successfully parsed JSON response:", jsonData);
      return jsonData;
    } catch (error) {
      console.log("API Client - Failed to parse JSON response:", error);
      return null;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T | null> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T | null> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T | null> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T | null> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

// User API functions
export const getCurrentUser = async () => {
  return apiClient.get("/users/me");
};

export const updateUser = async (userData: any) => {
  return apiClient.put("/users/me", userData);
};

export const updateUserAddress = async (addressData: any) => {
  return apiClient.put("/users/me/address", addressData);
};
