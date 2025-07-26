import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080",
});

export const getAdminDashboardData = async () => {
  try {
    const [sales, orders, customers, pie, trend, timeline] = await Promise.all([
      api.get("/api/v1/admin/reports/total-sales"),
      api.get("/api/v1/admin/reports/total-orders"),
      api.get("/api/v1/admin/reports/total-customers"),
      api.get("/api/v1/admin/reports/category-distribution"),
      api.get("/api/v1/admin/reports/revenue-trend"),
      api.get("/api/v1/admin/reports/monthly-revenue-timeline"),
    ]);

    return {
      totalSales: sales.data,
      totalOrders: orders.data,
      totalCustomers: customers.data,
      categoryPieData: pie.data, // [{ value, name }]
      trendLabels: trend.data.map((d: any) => d.date),
      revenueTrend: trend.data.map((d: any) => d.revenue),
      revenueTimeline: timeline.data,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    // Return fallback data if API fails
    return {
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      categoryPieData: [],
      trendLabels: [],
      revenueTrend: [],
      revenueTimeline: [],
    };
  }
};

export const listOrders = async () => {
  try {
    const res = await api.get("/api/v1/orders");
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const listCustomers = async () => {
  try {
    const res = await api.get("/api/v1/admin/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getOrderCount = async (userId: number) => {
  try {
    const res = await api.get(`/api/v1/admin/users/${userId}/orders`);
    return res.data.length;
  } catch (error) {
    console.error("Error fetching order count:", error);
    return 0;
  }
};
export const addProduct = async (product: any, images: File[] = []) => {
  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("categoryName", product.categoryName);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    images.forEach((img, idx) => formData.append("images", img));
    const res = await api.post("/api/v1/products/admin", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  product: any,
  images: File[] = []
) => {
  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("categoryName", product.categoryName);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    images.forEach((img, idx) => formData.append("images", img));
    const res = await api.put(`/api/v1/products/admin/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const listPayments = async () => {
  try {
    const res = await api.get("/api/v1/payments");
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const listShipments = async () => {
  try {
    // For now, we'll use orders data to simulate shipments
    const orders = await listOrders();
    return orders.map((order: any, index: number) => ({
      id: index + 1,
      orderId: order.id,
      carrier: "Standard Delivery",
      trackingNumber: `TRK${order.id.toString().padStart(6, "0")}`,
      status: order.status === "completed" ? "Delivered" : "In Transit",
      shippedAt: order.placedAt,
      deliveredAt: order.status === "completed" ? order.placedAt : null,
    }));
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
};

export const listInventory = async () => {
  try {
    const res = await api.get("/api/v1/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
