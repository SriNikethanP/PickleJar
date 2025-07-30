"use server";

import axios from "axios";
import type { Product } from "./products";
import { measureAsync } from "@lib/util/performance";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple cache for categories data
let categoriesCache: any = null;
let categoriesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export type Category = {
  id: number;
  name: string;
  description?: string;
  handle?: string;
  products: Product[];
};

export const listCategories = async (): Promise<Category[]> => {
  return measureAsync("listCategories", async () => {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && now - categoriesCacheTime < CACHE_DURATION) {
      return categoriesCache;
    }

    try {
      const res = await api.get("/categories");
      const categories = Array.isArray(res.data)
        ? res.data
            .map((category: any) => ({
              id: category.id,
              name: category.name,
              description: category.description,
              handle: category.name?.toLowerCase().replace(/\s+/g, "-"),
              products: category.products || [],
            }))
            .filter(
              (category): category is Category =>
                category.id &&
                category.name &&
                typeof category.name === "string"
            )
        : [];

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
export const clearCategoriesCache = async () => {
  categoriesCache = null;
  categoriesCacheTime = 0;
};

export const getCategoryByHandle = async (
  categoryHandle: string[]
): Promise<Category | null> => {
  return measureAsync(
    `getCategoryByHandle-${categoryHandle.join("-")}`,
    async () => {
      try {
        const categories = await listCategories();
        const handle = categoryHandle[categoryHandle.length - 1];

        return (
          categories.find((category) => category.handle === handle) || null
        );
      } catch (error) {
        console.error("Error fetching category by handle:", error);
        return null;
      }
    }
  );
};
