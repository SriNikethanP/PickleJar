"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for products data
let productsCache: any = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getProducts = async (): Promise<any[]> => {
  return measureAsync("getProducts", async () => {
    // Check cache first
    const now = Date.now();
    if (productsCache && now - productsCacheTime < CACHE_DURATION) {
      return productsCache;
    }

    try {
      // TODO: Use /products endpoint once products are activated
      // For now, use admin endpoint to get all products including inactive ones
      const result = await apiClient.get("/products/admin");
      const products = result || [];

      // Cache the result
      productsCache = products;
      productsCacheTime = now;

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  });
};

// Clear cache when needed
export const clearProductsCache = async (): Promise<void> => {
  productsCache = null;
  productsCacheTime = 0;
};

export const getProduct = async (handle: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/products/${handle}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getProductsByCategory = async (
  categoryId: number
): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/categories/${categoryId}/products`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getProductsByCollection = async (
  collectionId: number
): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/collections/${collectionId}/products`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<any[]> => {
  try {
    const result = await apiClient.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<any[]> => {
  try {
    const result = await apiClient.get("/products/featured");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const getProductReviews = async (productId: number): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/products/${productId}/reviews`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};

export const addProductReview = async (
  productId: number,
  review: any
): Promise<any> => {
  try {
    const result = await apiClient.post(
      `/products/${productId}/reviews`,
      review
    );
    return result || null;
  } catch (error) {
    console.error("Error adding product review:", error);
    throw error;
  }
};

// Legacy exports for backward compatibility
export const getAllProducts = getProducts;
export const listProductsByCollection = getProductsByCollection;
