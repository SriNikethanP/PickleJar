import { useCallback, useEffect, useRef } from "react";
import { frontendCache } from "@lib/data/frontend-cache";

interface PrefetchOptions {
  key: string;
  fetchFn: () => Promise<any>;
  ttl?: number;
  dependencies?: any[];
}

export function useDataPrefetch({
  key,
  fetchFn,
  ttl = 5 * 60 * 1000,
  dependencies = [],
}: PrefetchOptions) {
  const isPrefetched = useRef(false);

  const prefetch = useCallback(async () => {
    if (isPrefetched.current) return;

    // Check if data is already cached
    if (frontendCache.has(key)) {
      isPrefetched.current = true;
      return;
    }

    try {
      const data = await fetchFn();
      frontendCache.set(key, data, ttl);
      isPrefetched.current = true;
    } catch (error) {
      console.error("Error prefetching data:", error);
    }
  }, [key, fetchFn, ttl]);

  useEffect(() => {
    prefetch();
  }, [prefetch, ...dependencies]);

  return { prefetch };
}
