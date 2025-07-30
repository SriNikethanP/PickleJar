"use server";

import axios from "axios";
import { measureAsync } from "@lib/util/performance";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple cache for collections data
let collectionsCache: any = null;
let collectionsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export type Collection = {
  id: string;
  title: string;
};

export const listCollections = async (): Promise<Collection[]> => {
  return measureAsync("listCollections", async () => {
    // Check cache first
    const now = Date.now();
    if (collectionsCache && now - collectionsCacheTime < CACHE_DURATION) {
      return collectionsCache;
    }

    try {
      const res = await api.get("/collections");
      const collections = Array.isArray(res.data)
        ? res.data
            .map((collection: any) => ({
              id: collection.id?.toString(),
              title: collection.title,
            }))
            .filter(
              (collection): collection is Collection =>
                collection.id &&
                collection.title &&
                typeof collection.title === "string"
            )
        : [];

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
export const clearCollectionsCache = async () => {
  collectionsCache = null;
  collectionsCacheTime = 0;
};
