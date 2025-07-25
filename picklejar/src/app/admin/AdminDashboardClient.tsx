"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import EChartsClient from "./EChartsClient";

export default function AdminDashboardClient({ data }: { data: any }) {
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
            <EChartsClient
              type="pie"
              data={data.categoryPieData}
              legend={true}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <EChartsClient
              type="line"
              data={data.revenueTrend}
              labels={data.trendLabels}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 