import { useState, useEffect, useCallback } from "react";
import { frontendCache } from "@lib/data/frontend-cache";

interface UseOptimizedDataOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  ttl?: number;
  dependencies?: any[];
  enabled?: boolean;
}

export function useOptimizedData<T>({
  key,
  fetchFn,
  ttl = 5 * 60 * 1000,
  dependencies = [],
  enabled = true,
}: UseOptimizedDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cachedData = frontendCache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      frontendCache.set(key, result, ttl);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    frontendCache.delete(key);
    fetchData();
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Predefined hooks for common data types
export function useProducts() {
  return useOptimizedData({
    key: "products",
    fetchFn: async () => {
      const { getAllProducts } = await import("@lib/data/products");
      return getAllProducts();
    },
  });
}

export function useCollections() {
  return useOptimizedData({
    key: "collections",
    fetchFn: async () => {
      const { listCollections } = await import("@lib/data/collections");
      return listCollections();
    },
  });
}

export function useCategories() {
  return useOptimizedData({
    key: "categories",
    fetchFn: async () => {
      const { listCategories } = await import("@lib/data/categories");
      return listCategories();
    },
  });
}

export function useRegion(countryCode: string = "in") {
  return useOptimizedData({
    key: `region-${countryCode}`,
    fetchFn: async () => {
      const { getRegion } = await import("@lib/data/regions");
      return getRegion(countryCode);
    },
    dependencies: [countryCode],
  });
}
