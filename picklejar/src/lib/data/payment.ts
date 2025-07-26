"use server";

import axios from "axios";
import { getAuthHeaders, getCacheOptions } from "./cookies";
import { HttpTypes } from "@medusajs/types";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const listCartPaymentMethods = async (regionId: string) => {
  try {
    const res = await api.get("/payment-providers", {
      params: { region_id: regionId },
    });
    return res.data.payment_providers.sort((a: any, b: any) =>
      a.id > b.id ? 1 : -1
    );
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};
