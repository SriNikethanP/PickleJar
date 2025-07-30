"use server";

import { apiClient } from "@lib/api";

export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/payment-methods");
    return result || [];
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};

export const createPaymentIntent = async (paymentData: any): Promise<any> => {
  try {
    const result = await apiClient.post("/payments/create-intent", paymentData);
    return result || null;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (paymentId: string, paymentData: any): Promise<any> => {
  try {
    const result = await apiClient.post(`/payments/${paymentId}/confirm`, paymentData);
    return result || null;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};
