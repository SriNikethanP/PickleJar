"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for categories data
let categoriesCache: any = null;
let categoriesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCategories = async (): Promise<any[]> => {
  return measureAsync("getCategories", async () => {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && now - categoriesCacheTime < CACHE_DURATION) {
      return categoriesCache;
    }

    try {
      const result = await apiClient.get("/categories");
      const categories = result || [];
      
      // Cache the result
      categoriesCache = categories;
      categoriesCacheTime = now;

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  });
};

// Clear cache when needed
export const clearCategoriesCache = async (): Promise<void> => {
  categoriesCache = null;
  categoriesCacheTime = 0;
};

export const getCategory = async (handle: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/categories/${handle}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export const getCategoryProducts = async (categoryId: number): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/categories/${categoryId}/products`);
    return result || [];
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
};
