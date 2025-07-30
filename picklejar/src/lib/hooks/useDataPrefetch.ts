import { useState, useEffect, useCallback, useRef } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

interface UseDataPrefetchOptions {
  cacheDuration?: number; // in milliseconds
  enabled?: boolean;
}

export function useDataPrefetch<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDataPrefetchOptions = {}
) {
  const { cacheDuration = 5 * 60 * 1000, enabled = true } = options; // 5 minutes default
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCacheKey = useCallback(() => {
    return JSON.stringify(dependencies);
  }, [dependencies]);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      const cacheKey = getCacheKey();
      const now = Date.now();
      const cached = cacheRef.current.get(cacheKey);

      // Check if we have valid cached data
      if (!forceRefresh && cached && now - cached.timestamp < cacheDuration) {
        setData(cached.data);
        setIsLoading(false);
        setError(null);
        return;
      }

      // Check if there's an ongoing request for the same data
      if (cached?.promise) {
        try {
          const result = await cached.promise;
          setData(result);
          setIsLoading(false);
          setError(null);
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
        }
        return;
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
        const promise = fetchFunction();

        // Store the promise in cache to prevent duplicate requests
        cacheRef.current.set(cacheKey, {
          data: null as T,
          timestamp: now,
          promise,
        });

        const result = await promise;

        // Check if request was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        // Update cache with result
        cacheRef.current.set(cacheKey, {
          data: result,
          timestamp: now,
        });

        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        setError(err as Error);
        setIsLoading(false);
        cacheRef.current.delete(cacheKey);
      }
    },
    [fetchFunction, dependencies, cacheDuration, enabled, getCacheKey]
  );

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache,
  };
}
