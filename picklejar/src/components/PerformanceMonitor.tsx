"use client";

import { useEffect, useState } from "react";
import { perf } from "@lib/util/performance";

interface PerformanceMetrics {
  [key: string]: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(perf.getMetrics());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearMetrics = () => {
    perf.clearMetrics();
    setMetrics({});
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        title="Show Performance Monitor"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Performance Monitor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={clearMetrics}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
          <button
            onClick={toggleVisibility}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Object.keys(metrics).length === 0 ? (
          <p className="text-xs text-gray-500">No metrics recorded yet</p>
        ) : (
          Object.entries(metrics).map(([name, avgTime]) => (
            <div key={name} className="flex justify-between text-xs">
              <span className="text-gray-700 truncate">{name}</span>
              <span
                className={`font-mono ${
                  avgTime > 1000
                    ? "text-red-600"
                    : avgTime > 500
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {avgTime.toFixed(0)}ms
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>🟢 &lt;500ms</div>
          <div>🟡 500-1000ms</div>
          <div>🔴 &gt;1000ms</div>
        </div>
      </div>
    </div>
  );
}
