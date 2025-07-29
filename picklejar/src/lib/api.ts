const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1";

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem("accessToken");
    console.log("Auth token:", token ? "Present" : "Missing");
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

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    console.log(`Making ${options.method || "GET"} request to: ${url}`);
    console.log("Request headers:", headers);
    if (options.body) {
      console.log("Request body:", options.body);
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    console.log(`Response status: ${response.status}`);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
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
        console.log("Error response JSON:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.log("Failed to parse error response as JSON:", parseError);
        // If response is not JSON, try to get text content
        try {
          const textContent = await response.text();
          console.log("Error response text:", textContent);
          if (textContent && textContent.trim()) {
            errorMessage = textContent;
          }
        } catch (textError) {
          console.log("Failed to get error response text:", textError);
          // If all else fails, use the default error message
        }
      }
      console.log("Final error message:", errorMessage);
      throw new Error(errorMessage);
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
  async delete<T>(endpoint: string): Promise<T> {
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
