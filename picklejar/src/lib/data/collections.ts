"use server";

import { apiClient } from "@lib/api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for collections data
let collectionsCache: any = null;
let collectionsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCollections = async (): Promise<any[]> => {
  return measureAsync("getCollections", async () => {
    // Check cache first
    const now = Date.now();
    if (collectionsCache && now - collectionsCacheTime < CACHE_DURATION) {
      return collectionsCache;
    }

    try {
      const result = await apiClient.get("/collections");
      const collections = result || [];
      
      // Cache the result
      collectionsCache = collections;
      collectionsCacheTime = now;

      return collections;
    } catch (error) {
      console.error("Error fetching collections:", error);
      return [];
    }
  });
};

// Clear cache when needed
export const clearCollectionsCache = async (): Promise<void> => {
  collectionsCache = null;
  collectionsCacheTime = 0;
};

export const getCollection = async (handle: string): Promise<any> => {
  try {
    const result = await apiClient.get(`/collections/${handle}`);
    return result || null;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
};

export const getCollectionProducts = async (collectionId: number): Promise<any[]> => {
  try {
    const result = await apiClient.get(`/collections/${collectionId}/products`);
    return result || [];
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return [];
  }
};
