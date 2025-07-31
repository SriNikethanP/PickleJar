"use server";

import { apiClient } from "@lib/api";

export const getFulfillmentOptions = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/fulfillment-options");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching fulfillment options:", error);
    return [];
  }
};

export const createFulfillment = async (fulfillmentData: any): Promise<any> => {
  try {
    const result = await apiClient.post("/fulfillments", fulfillmentData);
    return result || null;
  } catch (error) {
    console.error("Error creating fulfillment:", error);
    throw error;
  }
};

export const getFulfillment = async (fulfillmentId: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/fulfillments/${fulfillmentId}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching fulfillment:", error);
    return null;
  }
};

export const cancelFulfillment = async (fulfillmentId: string): Promise<any> => {
  try {
    const result = await apiClient.post(`/fulfillments/${fulfillmentId}/cancel`);
    return result || null;
  } catch (error) {
    console.error("Error canceling fulfillment:", error);
    throw error;
  }
};
