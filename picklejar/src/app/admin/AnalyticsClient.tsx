"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import dynamic from "next/dynamic";

const ECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface AnalyticsClientProps {
  data: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    categoryPieData: Array<{ value: number; name: string }>;
    trendLabels: string[];
    revenueTrend: number[];
  };
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              ₹{data.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.categoryPieData.length}
            </div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ECharts
              option={{
                tooltip: { trigger: "axis" },
                xAxis: {
                  type: "category",
                  data:
                    data.trendLabels.length > 0
                      ? data.trendLabels
                      : ["No data"],
                },
                yAxis: { type: "value" },
                series: [
                  {
                    data:
                      data.revenueTrend.length > 0 ? data.revenueTrend : [0],
                    type: "line",
                    smooth: true,
                    areaStyle: {
                      color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          { offset: 0, color: "#60a5fa" },
                          { offset: 1, color: "#dbeafe" },
                        ],
                      },
                    },
                  },
                ],
              }}
              style={{ height: 300 }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ECharts
              option={{
                tooltip: { trigger: "item" },
                legend: { top: "5%", left: "center" },
                series: [
                  {
                    name: "Categories",
                    type: "pie",
                    radius: ["40%", "70%"],
                    center: ["50%", "60%"],
                    data:
                      data.categoryPieData.length > 0
                        ? data.categoryPieData
                        : [{ value: 1, name: "No data" }],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                      },
                    },
                  },
                ],
              }}
              style={{ height: 300 }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
