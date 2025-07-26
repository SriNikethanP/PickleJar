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
    revenueTimeline: Array<{ year: number; month: number; revenue: number }>;
  };
}

const revenueOption = (data: AnalyticsClientProps["data"]) => ({
  title: {
    text: "Revenue Trend",
    left: "center",
  },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data:
      data.trendLabels && data.trendLabels.length > 0
        ? data.trendLabels
        : ["No data"],
  },
  yAxis: { type: "value" },
  series: [
    {
      data:
        data.revenueTrend && data.revenueTrend.length > 0
          ? data.revenueTrend
          : [0],
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
});

function getMonthlyTimelineOption(timeline: any[]) {
  // Group by year
  const grouped: Record<string, { month: string; revenue: number }[]> = {};
  timeline.forEach(({ year, month, revenue }) => {
    const y = String(year);
    const m = String(month).padStart(2, "0");
    if (!grouped[y]) grouped[y] = [];
    grouped[y].push({ month: m, revenue: Number(revenue) });
  });
  const years = Object.keys(grouped).sort();
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const options = years.map((year) => ({
    title: { text: `${year} Monthly Revenue` },
    series: [
      {
        data: months.map(
          (m) => grouped[year].find((d) => d.month === m)?.revenue ?? 0
        ),
        type: "bar",
        itemStyle: { color: "#60a5fa" },
      },
    ],
  }));
  return {
    baseOption: {
      timeline: {
        axisType: "category",
        autoPlay: false,
        playInterval: 1500,
        data: years,
        label: {
          formatter: (s: string) => s,
        },
      },
      title: { left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: [
        {
          type: "category",
          data: months.map((m) => `${m}`),
          axisLabel: { formatter: (v: string) => `Month ${v}` },
        },
      ],
      yAxis: [{ type: "value", name: "Revenue" }],
      series: [{ name: "Revenue", type: "bar" }],
    },
    options,
  };
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const timelineOption = getMonthlyTimelineOption(data.revenueTimeline || []);

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
            <CardTitle>Monthly Revenue Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ECharts option={timelineOption} style={{ height: 400 }} />
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
