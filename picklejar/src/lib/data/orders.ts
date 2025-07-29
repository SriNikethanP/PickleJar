"use server";

import axios from "axios";
import { getAuthHeaders } from "./cookies";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const retrieveOrder = async (id: string) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error retrieving order:", error);
    return null;
  }
};

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.get("/users/me/orders", {
      headers: authHeaders,
    });
    return res.data;
  } catch (error: any) {
    // Don't log 403 errors as they're expected when user is not authenticated
    if (error?.response?.status !== 403) {
      console.error("Error listing orders:", error);
    }
    return [];
  }
};

export const createTransferRequest = async (
  state: {
    success: boolean;
    error: string | null;
    order: any | null;
  },
  formData: FormData
): Promise<{
  success: boolean;
  error: string | null;
  order: any | null;
}> => {
  const id = formData.get("order_id") as string;
  if (!id) {
    return { success: false, error: "Order ID is required", order: null };
  }
  try {
    const res = await api.post(`/orders/${id}/transfer-request`, formData);
    return { success: true, error: null, order: res.data };
  } catch (err: any) {
    return { success: false, error: err.message, order: null };
  }
};

export const acceptTransferRequest = async (id: string, token: string) => {
  try {
    const res = await api.post(`/orders/${id}/accept-transfer`, { token });
    return { success: true, error: null, order: res.data };
  } catch (err: any) {
    return { success: false, error: err.message, order: null };
  }
};

export const declineTransferRequest = async (id: string, token: string) => {
  try {
    const res = await api.post(`/orders/${id}/decline-transfer`, { token });
    return { success: true, error: null, order: res.data };
  } catch (err: any) {
    return { success: false, error: err.message, order: null };
  }
};
