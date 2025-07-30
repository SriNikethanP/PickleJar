"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AUTH_KEYS,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  clearAdminAuth,
} from "@lib/util/auth-persistence";

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
      // First try to get admin from localStorage
      const storedAdmin = getLocalStorage(AUTH_KEYS.ADMIN.USER_DATA);
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        setAdmin(adminData);
        console.log("Admin restored from localStorage:", adminData);
      }

      const token = getLocalStorage(AUTH_KEYS.ADMIN.ACCESS_TOKEN);
      if (!token) {
        console.log("No admin access token found in localStorage");
        setIsLoading(false);
        return;
      }

      // Only check /me endpoint for background validation, but do not clear session on error
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData.role === "ADMIN") {
            setAdmin(userData);
            setLocalStorage(
              AUTH_KEYS.ADMIN.USER_DATA,
              JSON.stringify(userData)
            );
          }
        }
      } catch (err) {
        // Do not clear session, just log
        console.warn("/me check failed, but session persists until logout");
      }
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
        setLocalStorage(AUTH_KEYS.ADMIN.ACCESS_TOKEN, data.accessToken);
        setLocalStorage(AUTH_KEYS.ADMIN.REFRESH_TOKEN, data.refreshToken);
        setLocalStorage(AUTH_KEYS.ADMIN.USER_DATA, JSON.stringify(data.user));

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
    clearAdminAuth();
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
