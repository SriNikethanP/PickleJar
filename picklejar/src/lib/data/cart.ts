"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for cart data
let cartCache: any = null;
let cartCacheTime = 0;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute (shorter for cart)

export const getCart = async (): Promise<any> => {
  return measureAsync("getCart", async () => {
    // Check cache first
    const now = Date.now();
    if (cartCache && now - cartCacheTime < CACHE_DURATION) {
      return cartCache;
    }

    try {
      const result = await apiClient.get("/cart");
      const cart = result || null;
      
      // Cache the result
      cartCache = cart;
      cartCacheTime = now;

      return cart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;
    }
  });
};

// Clear cache when needed
export const clearCartCache = async (): Promise<void> => {
  cartCache = null;
  cartCacheTime = 0;
};

export const addToCart = async (productId: number, quantity: number): Promise<any> => {
  try {
    const result = await apiClient.post("/cart", { productId, quantity });
    await clearCartCache();
    return result || null;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (cartItemId: number, quantity: number): Promise<any> => {
  try {
    const result = await apiClient.put("/cart/item", { cartItemId, quantity });
    await clearCartCache();
    return result || null;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: number): Promise<any> => {
  try {
    const result = await apiClient.delete(`/cart/item?cartItemId=${cartItemId}`);
    await clearCartCache();
    return result || null;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.delete("/cart");
    await clearCartCache();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export const checkout = async (checkoutData: any): Promise<any> => {
  try {
    const result = await apiClient.post("/cart/checkout", checkoutData);
    await clearCartCache();
    return result || null;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};

export const codCheckout = async (userDetails: any): Promise<any> => {
  try {
    const result = await apiClient.post("/cart/checkout/cod", userDetails);
    await clearCartCache();
    return result || null;
  } catch (error) {
    console.error("Error during COD checkout:", error);
    throw error;
  }
};
