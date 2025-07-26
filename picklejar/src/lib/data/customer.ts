"use server";
import axios from "axios";

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
    const res = await api.get("/admin/users");
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
    return res.data;
  } catch (error: any) {
    return error?.response?.data?.message || "Login failed";
  }
};

export const signup = async (_: any, formData: FormData) => {
  const userRegistrationDTO = {
    firstName: formData.get("first_name") as string,
    lastName: formData.get("last_name") as string,
    email: formData.get("email") as string,
    mobile: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("password") as string,
  };
  try {
    const res = await api.post("/auth/register", userRegistrationDTO);
    return res.data;
  } catch (error: any) {
    return error?.response?.data?.message || "Registration failed";
  }
};

export const retrieveCustomer = async (
  userId: number
): Promise<User | null> => {
  try {
    const res = await api.get("/users", { params: { userId } });
    return res.data;
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return null;
  }
};
