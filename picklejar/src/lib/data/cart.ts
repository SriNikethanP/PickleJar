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
    } catch (error: any) {
      // Handle authentication errors gracefully
      if (
        error?.message?.includes("Forbidden") ||
        error?.message?.includes("401") ||
        error?.message?.includes("403")
      ) {
        console.warn("User not authenticated, returning empty cart");
        return {
          id: null,
          items: [],
          total: 0,
          subtotal: 0,
          tax_total: 0,
          shipping_total: 0,
          discount_total: 0,
          gift_card_total: 0,
        };
      }
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

export const addToCart = async (
  productId: number,
  quantity: number
): Promise<any> => {
  try {
    const result = await apiClient.post("/cart", { productId, quantity });
    await clearCartCache();
    return result || null;
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (
      error?.message?.includes("Forbidden") ||
      error?.message?.includes("401") ||
      error?.message?.includes("403")
    ) {
      console.warn("User not authenticated, cannot add to cart");
      throw new Error("Please log in to add items to cart");
    }
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (
  cartItemId: number,
  quantity: number
): Promise<any> => {
  try {
    const result = await apiClient.put("/cart/item", { cartItemId, quantity });
    await clearCartCache();
    return result || null;
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (
      error?.message?.includes("Forbidden") ||
      error?.message?.includes("401") ||
      error?.message?.includes("403")
    ) {
      console.warn("User not authenticated, cannot update cart");
      throw new Error("Please log in to update cart");
    }
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: number): Promise<any> => {
  try {
    const result = await apiClient.delete(
      `/cart/item?cartItemId=${cartItemId}`
    );
    await clearCartCache();
    return result || null;
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (
      error?.message?.includes("Forbidden") ||
      error?.message?.includes("401") ||
      error?.message?.includes("403")
    ) {
      console.warn("User not authenticated, cannot remove from cart");
      throw new Error("Please log in to remove items from cart");
    }
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.delete("/cart");
    await clearCartCache();
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (
      error?.message?.includes("Forbidden") ||
      error?.message?.includes("401") ||
      error?.message?.includes("403")
    ) {
      console.warn("User not authenticated, cannot clear cart");
      throw new Error("Please log in to clear cart");
    }
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

// Legacy exports for backward compatibility
export const retrieveCart = getCart;
export const assignCart = async (
  cartId: number,
  customerId: number
): Promise<any> => {
  try {
    const result = await apiClient.put("/cart/assign", { cartId, customerId });
    return result || null;
  } catch (error) {
    console.error("Error assigning cart:", error);
    throw error;
  }
};
