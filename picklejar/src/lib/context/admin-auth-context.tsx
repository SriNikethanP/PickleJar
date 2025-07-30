"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Helper function to safely access localStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1";

  // Check if admin is authenticated on mount
  useEffect(() => {
    checkAdminAuthStatus();
  }, []);

  const checkAdminAuthStatus = async () => {
    try {
      const token = getLocalStorage("adminAccessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify admin token by calling the /me endpoint
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Check if the user has admin role
        if (userData.role === "ADMIN") {
          setAdmin(userData);
        } else {
          // User is not admin, clear token
          removeLocalStorage("adminAccessToken");
          removeLocalStorage("adminRefreshToken");
        }
      } else {
        // Token is invalid, clear it
        removeLocalStorage("adminAccessToken");
        removeLocalStorage("adminRefreshToken");
      }
    } catch (error) {
      console.error("Error checking admin auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the user has admin role
        if (data.user.role !== "ADMIN") {
          toast.error("Access denied. Admin privileges required.");
          return false;
        }

        // Store admin tokens separately from regular user tokens
        setLocalStorage("adminAccessToken", data.accessToken);
        setLocalStorage("adminRefreshToken", data.refreshToken);
        setLocalStorage("adminUser", JSON.stringify(data.user));

        setAdmin(data.user);
        toast.success("Admin login successful!");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Admin login failed");
        return false;
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Admin login failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    removeLocalStorage("adminAccessToken");
    removeLocalStorage("adminRefreshToken");
    removeLocalStorage("adminUser");
    setAdmin(null);
    toast.success("Admin logged out successfully");
  };

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
