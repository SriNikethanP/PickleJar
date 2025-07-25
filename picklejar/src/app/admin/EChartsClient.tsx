"use client";
import dynamic from "next/dynamic";
import React from "react";

const ECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function EChartsClient({ type, data, labels, legend }: {
  type: "pie" | "line",
  data: any[],
  labels?: string[],
  legend?: boolean
}) {
  if (type === "pie") {
    return (
      <ECharts
        option={{
          tooltip: { trigger: "item" },
          legend: legend ? { top: "5%", left: "center" } : undefined,
          series: [
            {
              name: "Categories",
              type: "pie",
              radius: ["40%", "70%"],
              data,
            },
          ],
        }}
        style={{ height: 300 }}
      />
    );
  }
  if (type === "line") {
    return (
      <ECharts
        option={{
          xAxis: { type: "category", data: labels },
          yAxis: { type: "value" },
          series: [
            {
              data,
              type: "line",
              smooth: true,
            },
          ],
        }}
        style={{ height: 300 }}
      />
    );
  }
  return null;
} 