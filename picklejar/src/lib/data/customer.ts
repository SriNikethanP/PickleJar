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
  const res = await api.get('/admin/users');
  return res.data;
};
