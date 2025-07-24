import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { getAdminDashboardData } from "@/lib/data/admin";

const ECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{data.totalSales}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{data.totalOrders}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{data.totalCustomers}</span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
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
                    data: data.categoryPieData,
                  },
                ],
              }}
              style={{ height: 300 }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ECharts
              option={{
                xAxis: { type: "category", data: data.trendLabels },
                yAxis: { type: "value" },
                series: [
                  {
                    data: data.revenueTrend,
                    type: "line",
                    smooth: true,
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
