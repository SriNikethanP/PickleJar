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

export const listOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const listCustomers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getOrderCount = async (userId: number) => {
  const res = await api.get(`/admin/users/${userId}/orders`);
  return res.data.length;
};

export const listPayments = async () => {
  const res = await api.get("/payments");
  return res.data;
};

export const listShipments = async () => {
  // TODO: Replace with real API call
  return [
    {
      id: 1,
      orderId: 101,
      carrier: "FedEx",
      trackingNumber: "123456",
      status: "Shipped",
      shippedAt: "2024-05-01",
      deliveredAt: null,
    },
    {
      id: 2,
      orderId: 102,
      carrier: "UPS",
      trackingNumber: "654321",
      status: "Delivered",
      shippedAt: "2024-04-28",
      deliveredAt: "2024-05-02",
    },
  ];
};

export const listInventory = async () => {
  const { products } = await api
    .get("/products/search")
    .then((res) => res.data);
  return products;
};
