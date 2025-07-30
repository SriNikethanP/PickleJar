import { useState, useEffect, useCallback, useRef } from "react";
import { frontendCache, CACHE_KEYS } from "@lib/data/frontend-cache";

interface UseOptimizedDataOptions {
  cacheKey: string;
  fetchFunction: () => Promise<any>;
  ttl?: number; // Time to live in milliseconds
  enabled?: boolean;
  dependencies?: any[];
}

export function useOptimizedData<T>({
  cacheKey,
  fetchFunction,
  ttl = 5 * 60 * 1000, // 5 minutes default
  enabled = true,
  dependencies = [],
}: UseOptimizedDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (!forceRefresh) {
        const cachedData = frontendCache.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();

        // Check if request was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        // Cache the result
        frontendCache.set(cacheKey, result, ttl);

        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        setError(err as Error);
        setIsLoading(false);
      }
    },
    [cacheKey, fetchFunction, ttl, enabled]
  );

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    frontendCache.delete(cacheKey);
  }, [cacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache,
  };
}

// Predefined hooks for common data types
export function useProducts() {
  return useOptimizedData({
    cacheKey: CACHE_KEYS.PRODUCTS,
    fetchFunction: async () => {
      const { getAllProducts } = await import("@lib/data/products");
      return getAllProducts();
    },
  });
}

export function useCollections() {
  return useOptimizedData({
    cacheKey: CACHE_KEYS.COLLECTIONS,
    fetchFunction: async () => {
      const { listCollections } = await import("@lib/data/collections");
      return listCollections();
    },
  });
}

export function useCategories() {
  return useOptimizedData({
    cacheKey: CACHE_KEYS.CATEGORIES,
    fetchFunction: async () => {
      const { listCategories } = await import("@lib/data/categories");
      return listCategories();
    },
  });
}

export function useRegion(countryCode: string = "in") {
  return useOptimizedData({
    cacheKey: `${CACHE_KEYS.REGION}-${countryCode}`,
    fetchFunction: async () => {
      const { getRegion } = await import("@lib/data/regions");
      return getRegion(countryCode);
    },
    dependencies: [countryCode],
  });
}
