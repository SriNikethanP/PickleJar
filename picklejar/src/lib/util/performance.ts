// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      this.metrics.get(name)!.push(duration);

      // Log slow operations
      if (duration > 1000) {
        console.warn(
          `Slow operation detected: ${name} took ${duration.toFixed(2)}ms`
        );
      }
    };
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;

    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    Array.from(this.metrics.entries()).forEach(([name, times]) => {
      result[name] = this.getAverageTime(name);
    });
    return result;
  }
}

// Convenience functions
export const perf = PerformanceMonitor.getInstance();

export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const stopTimer = perf.startTimer(name);
  try {
    const result = await fn();
    return result;
  } finally {
    stopTimer();
  }
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  const stopTimer = perf.startTimer(name);
  try {
    const result = fn();
    return result;
  } finally {
    stopTimer();
  }
};
