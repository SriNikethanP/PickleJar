"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@lib/api";

export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  address?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: () => boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1";

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("No access token found in localStorage");
        setIsLoading(false);
        return;
      }

      console.log("Checking auth status with token:", {
        token: token ? "Present" : "Missing",
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
      });

      // Use apiClient to verify token by calling the /me endpoint
      // This will handle token refresh automatically if needed
      const userData = await apiClient.get<User>("/users/me");
      console.log("User data received:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear auth data on error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, user data:", data);
        console.log("Token details:", {
          accessToken: data.accessToken ? "Present" : "Missing",
          accessTokenLength: data.accessToken ? data.accessToken.length : 0,
          refreshToken: data.refreshToken ? "Present" : "Missing",
          refreshTokenLength: data.refreshToken ? data.refreshToken.length : 0,
        });

        // Store tokens and user data
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Verify tokens were stored
        const storedToken = localStorage.getItem("accessToken");
        console.log("Stored token verification:", {
          stored: storedToken ? "Present" : "Missing",
          length: storedToken ? storedToken.length : 0,
          matches: storedToken === data.accessToken,
        });

        setUser(data.user);
        toast.success("Login successful!");
        return true;
      } else {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse login error response:", parseError);
          // Try to get text content
          try {
            const textContent = await response.text();
            if (textContent && textContent.trim()) {
              errorMessage = textContent;
            }
          } catch (textError) {
            console.error("Failed to get error text:", textError);
          }
        }
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your connection and try again.");
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log("Attempting registration for:", userData.email);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Registration response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful, user data:", data);
        console.log("Token details:", {
          accessToken: data.accessToken ? "Present" : "Missing",
          accessTokenLength: data.accessToken ? data.accessToken.length : 0,
          refreshToken: data.refreshToken ? "Present" : "Missing",
          refreshTokenLength: data.refreshToken ? data.refreshToken.length : 0,
        });

        // Store tokens and user data
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Verify tokens were stored
        const storedToken = localStorage.getItem("accessToken");
        console.log("Stored token verification:", {
          stored: storedToken ? "Present" : "Missing",
          length: storedToken ? storedToken.length : 0,
          matches: storedToken === data.accessToken,
        });

        setUser(data.user);
        toast.success("Registration successful!");
        return true;
      } else {
        let errorMessage = "Registration failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error(
            "Failed to parse registration error response:",
            parseError
          );
          // Try to get text content
          try {
            const textContent = await response.text();
            if (textContent && textContent.trim()) {
              errorMessage = textContent;
            }
          } catch (textError) {
            console.error("Failed to get error text:", textError);
          }
        }
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "Registration failed. Please check your connection and try again."
      );
      return false;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("No refresh token found");
        return false;
      }

      console.log("Attempting token refresh");

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log("Token refresh response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Token refresh successful");

        // Update tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        return true;
      } else {
        console.log("Token refresh failed");
        let errorMessage = "Token refresh failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse refresh error response:", parseError);
        }
        console.error("Token refresh error:", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    return !!(token && user);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
