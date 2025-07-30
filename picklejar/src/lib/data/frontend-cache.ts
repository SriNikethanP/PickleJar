// Frontend caching utility for better performance
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class FrontendCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const frontendCache = new FrontendCache();

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: "products",
  COLLECTIONS: "collections",
  CATEGORIES: "categories",
  REGION: "region",
  CUSTOMER: "customer",
  CART: "cart",
} as const;

// Utility functions for common cache operations
export const cacheProducts = (products: any[]) => {
  frontendCache.set(CACHE_KEYS.PRODUCTS, products);
};

export const getCachedProducts = () => {
  return frontendCache.get(CACHE_KEYS.PRODUCTS);
};

export const cacheCollections = (collections: any[]) => {
  frontendCache.set(CACHE_KEYS.COLLECTIONS, collections);
};

export const getCachedCollections = () => {
  return frontendCache.get(CACHE_KEYS.COLLECTIONS);
};

export const cacheCategories = (categories: any[]) => {
  frontendCache.set(CACHE_KEYS.CATEGORIES, categories);
};

export const getCachedCategories = () => {
  return frontendCache.get(CACHE_KEYS.CATEGORIES);
};

export const cacheRegion = (region: any) => {
  frontendCache.set(CACHE_KEYS.REGION, region);
};

export const getCachedRegion = () => {
  return frontendCache.get(CACHE_KEYS.REGION);
};

// Clear all caches
export const clearAllCaches = () => {
  frontendCache.clear();
};

// Cleanup expired entries periodically
if (typeof window !== "undefined") {
  setInterval(() => {
    frontendCache.cleanup();
  }, 60000); // Cleanup every minute
}
