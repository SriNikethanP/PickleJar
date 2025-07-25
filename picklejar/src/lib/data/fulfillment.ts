"use server";

import axios from "axios";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders, getCacheOptions } from "./cookies";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const listCartShippingMethods = async (cartId: string) => {
  const params = {
    cart_id: cartId,
    fields:
      "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
  };
  try {
    const res = await api.get("/shipping-options", { params });
    return res.data.shipping_options;
  } catch {
    return null;
  }
};

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const body = { cart_id: cartId, data };
  try {
    const res = await api.post(`/shipping-options/${optionId}/calculate`, body);
    return res.data.shipping_option;
  } catch {
    return null;
  }
};
