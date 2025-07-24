import axios from "axios";
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
});

export const getAdminDashboardData = async () => {
  const [sales, orders, customers, pie, trend] = await Promise.all([
    api.get("/admin/reports/total-sales"),
    api.get("/admin/reports/total-orders"),
    api.get("/admin/reports/total-customers"),
    api.get("/admin/reports/category-distribution"),
    api.get("/admin/reports/revenue-trend"),
  ]);
  return {
    totalSales: sales.data,
    totalOrders: orders.data,
    totalCustomers: customers.data,
    categoryPieData: pie.data, // [{ value, name }]
    trendLabels: trend.data.map((d: any) => d.date),
    revenueTrend: trend.data.map((d: any) => d.revenue),
  };
};
