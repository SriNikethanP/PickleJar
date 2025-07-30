"use server";
import axios from "axios";
import { removeAuthToken } from "./cookies";
import { redirect } from "next/navigation";
import { getAuthHeaders } from "./cookies";
import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type User = {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  banned: boolean;
  address: any;
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.get("/admin/users", { headers: authHeaders });
    return res.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const login = async (_: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const res = await api.post("/auth/login", { email, password });
    // Return success message instead of the user object
    return "Login successful";
  } catch (error: any) {
    // Show the actual error message from the backend
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    // Fallback for network errors or other issues
    return "Login failed. Please try again.";
  }
};

export const signup = async (_: any, formData: FormData) => {
  const userRegistrationDTO = {
    fullName: formData.get("full_name") as string,
    email: formData.get("email") as string,
    mobile: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm_password") as string,
  };

  // Validate that passwords match
  if (userRegistrationDTO.password !== userRegistrationDTO.confirmPassword) {
    return "Passwords do not match";
  }

  try {
    const res = await api.post("/auth/register", userRegistrationDTO);
    // Return success message instead of the user object
    return "Registration successful! Please sign in.";
  } catch (error: any) {
    // Show the actual error message from the backend
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    // Fallback for network errors or other issues
    return "Registration failed. Please try again.";
  }
};

export const getCustomer = async (): Promise<any> => {
  return measureAsync("getCustomer", async () => {
    try {
      const result = await apiClient.get("/users/me");
      return result || null;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  });
};

export const updateCustomer = async (customerData: any): Promise<any> => {
  try {
    const result = await apiClient.put("/users/me", customerData);
    return result || null;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const updateCustomerAddress = async (addressData: any): Promise<any> => {
  try {
    const result = await apiClient.put("/users/me/address", addressData);
    return result || null;
  } catch (error) {
    console.error("Error updating customer address:", error);
    throw error;
  }
};

export const getCustomerAddresses = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/users/me/addresses");
    return result || [];
  } catch (error) {
    console.error("Error fetching customer addresses:", error);
    return [];
  }
};

export const addCustomerAddress = async (addressData: any): Promise<any> => {
  try {
    const result = await apiClient.post("/users/me/addresses", addressData);
    return result || null;
  } catch (error) {
    console.error("Error adding customer address:", error);
    throw error;
  }
};

export const updateCustomerAddressById = async (addressId: number, addressData: any): Promise<any> => {
  try {
    const result = await apiClient.put(`/users/me/addresses/${addressId}`, addressData);
    return result || null;
  } catch (error) {
    console.error("Error updating customer address:", error);
    throw error;
  }
};

export const deleteCustomerAddress = async (addressId: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/me/addresses/${addressId}`);
  } catch (error) {
    console.error("Error deleting customer address:", error);
    throw error;
  }
};

export const getCustomerOrders = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/users/me/orders");
    return result || [];
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
};

export const signout = async (countryCode: string) => {
  try {
    // Remove the authentication token
    await removeAuthToken();

    // Redirect to home page
    redirect(`/${countryCode}`);
  } catch (error) {
    console.error("Error during signout:", error);
    // Fallback redirect
    redirect(`/${countryCode}`);
  }
};
