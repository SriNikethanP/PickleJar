"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

export const getOrders = async (): Promise<any[]> => {
  return measureAsync("getOrders", async () => {
    try {
      const result = await apiClient.get("/users/me/orders");
      return result || [];
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
