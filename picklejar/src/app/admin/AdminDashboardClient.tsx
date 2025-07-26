"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import dynamic from "next/dynamic";

const ECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function AdminDashboardClient({ data }: { data: any }) {
  // Use only real backend data for category distribution
  const categoryData =
    Array.isArray(data.categoryPieData) && data.categoryPieData.length > 0
      ? data.categoryPieData
      : [];

  const nightingaleOption = {
    title: {
      text: "Category Distribution",
      subtext: "Product Categories by Sales",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      left: "center",
      top: "bottom",
      data: categoryData.map((item: any) => item.name),
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "Category Sales",
        type: "pie",
        radius: [20, 140],
        center: ["50%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data:
          categoryData.length > 0
            ? categoryData
            : [{ value: 1, name: "No data" }],
      },
    ],
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              ₹{data.totalSales?.toLocaleString() || 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {data.totalOrders?.toLocaleString() || 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {data.totalCustomers?.toLocaleString() || 0}
            </span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution (Nightingale Chart)</CardTitle>
          </CardHeader>
          <CardContent>
            <ECharts option={nightingaleOption} style={{ height: 400 }} />
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
}
