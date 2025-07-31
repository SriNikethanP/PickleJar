"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

// Type definitions for backward compatibility
export interface CustomProduct {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  stock: number;
  categoryName: string;
  averageRating: number;
}

export interface CustomOrderItem {
  id: number;
  product: CustomProduct;
  quantity: number;
  priceAtOrder: number;
  title?: string;
  thumbnail?: string;
}

export interface CustomOrder {
  id: number;
  display_id: number;
  total: number;
  currency_code: string;
  created_at: string;
  items: CustomOrderItem[];
  status: string;
  payment_method: string;
  shipping_address: any;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export const getOrders = async (): Promise<any[]> => {
  return measureAsync("getOrders", async () => {
    try {
      const result = await apiClient.get("/users/me/orders");
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  });
};

export const getOrder = async (orderId: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/orders/${orderId}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/orders/${orderId}/details`);
    return result || null;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};

export const cancelOrder = async (orderId: string): Promise<any> => {
  try {
    const result = await apiClient.post(`/orders/${orderId}/cancel`);
    return result || null;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

export const requestReturn = async (orderId: string, returnData: any): Promise<any> => {
  try {
    const result = await apiClient.post(`/orders/${orderId}/return`, returnData);
    return result || null;
  } catch (error) {
    console.error("Error requesting return:", error);
    throw error;
  }
};

export const getOrderTracking = async (orderId: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/orders/${orderId}/tracking`);
    return result || null;
  } catch (error) {
    console.error("Error fetching order tracking:", error);
    return null;
  }
};

// Legacy exports for backward compatibility
export const retrieveOrder = getOrder;
export const acceptTransferRequest = async (id: string, token: string): Promise<any> => {
  try {
    const result = await apiClient.post(`/orders/${id}/accept-transfer`, { token });
    return result || null;
  } catch (error) {
    console.error("Error accepting transfer request:", error);
    throw error;
  }
};
export const declineTransferRequest = async (id: string, token: string): Promise<any> => {
  try {
    const result = await apiClient.post(`/orders/${id}/decline-transfer`, { token });
    return result || null;
  } catch (error) {
    console.error("Error declining transfer request:", error);
    throw error;
  }
};
