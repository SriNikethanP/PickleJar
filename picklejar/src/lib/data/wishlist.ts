"use server";

import { apiClient } from "@lib/api";

export const getWishlist = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/wishlist");
    return result || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

export const addToWishlist = async (productId: number): Promise<any> => {
  try {
    const result = await apiClient.post("/wishlist", { productId });
    return result || null;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: number): Promise<void> => {
  try {
    await apiClient.delete(`/wishlist/${productId}`);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

export const clearWishlist = async (): Promise<void> => {
  try {
    await apiClient.delete("/wishlist");
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
};

export const isInWishlist = async (productId: number): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    return wishlist.some((item: any) => item.productId === productId);
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
};
