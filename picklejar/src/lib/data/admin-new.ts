import { uploadMultipleFilesAsBase64ToCloudinary } from "@lib/util/cloudinary";
import { adminApiClient } from "@lib/admin-api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for dashboard data
let dashboardCache: any = null;
let dashboardCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getAdminDashboardData = async () => {
  return measureAsync("getAdminDashboardData", async () => {
    // Check cache first
    const now = Date.now();
    if (dashboardCache && now - dashboardCacheTime < CACHE_DURATION) {
      return dashboardCache;
    }

    try {
      const [sales, orders, customers, pie, trend, timeline] =
        await Promise.all([
          adminApiClient.get("/admin/reports/total-sales"),
          adminApiClient.get("/admin/reports/total-orders"),
          adminApiClient.get("/admin/reports/total-customers"),
          adminApiClient.get("/admin/reports/category-distribution"),
          adminApiClient.get("/admin/reports/revenue-trend"),
          adminApiClient.get("/admin/reports/monthly-revenue-timeline"),
        ]);

      const result = {
        totalSales: sales,
        totalOrders: orders,
        totalCustomers: customers,
        categoryPieData: pie,
        trendLabels: (trend as any[]).map((d: any) => d.date),
        revenueTrend: (trend as any[]).map((d: any) => d.revenue),
        revenueTimeline: timeline,
      };

      // Cache the result
      dashboardCache = result;
      dashboardCacheTime = now;

      return result;
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
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
  });
};

// Clear cache when needed
export const clearDashboardCache = async () => {
  dashboardCache = null;
  dashboardCacheTime = 0;
};

export const listOrders = async () => {
  try {
    return await adminApiClient.get("/admin/orders");
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const listCustomers = async () => {
  try {
    return await adminApiClient.get("/admin/users");
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getOrderCount = async (userId: number) => {
  try {
    const res = await adminApiClient.get(`/admin/users/${userId}/orders`);
    return (res as any[]).length;
  } catch (error) {
    console.error("Error fetching order count:", error);
    return 0;
  }
};

export const addProduct = async (product: any, images: File[] = []) => {
  try {
    let imageUrls: string[] = [];
    if (images.length > 0) {
      const cloudinaryResults = await uploadMultipleFilesAsBase64ToCloudinary(
        images
      );
      imageUrls = cloudinaryResults.map((result) => result.secure_url);
    }

    const productData = {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
      stock: product.stock,
      imageUrls: imageUrls,
    };

    const result = await adminApiClient.post("/products/admin", productData);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error: any) {
    console.error("Error adding product:", error);
    throw new Error(error.message || "Failed to add product");
  }
};

export const updateProduct = async (
  id: number,
  product: any,
  images: File[] = []
) => {
  try {
    let imageUrls: string[] = [];
    if (images.length > 0) {
      const cloudinaryResults = await uploadMultipleFilesAsBase64ToCloudinary(
        images
      );
      imageUrls = cloudinaryResults.map((result) => result.secure_url);
    }

    const productData = {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
      stock: product.stock,
      imageUrls: imageUrls,
    };

    const result = await adminApiClient.put(
      `/products/admin/${id}`,
      productData
    );
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error: any) {
    console.error("Error updating product:", error);
    throw new Error(error.message || "Failed to update product");
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const result = await adminApiClient.delete(`/products/admin/${productId}`);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

export const deleteProductImage = async (
  productId: number,
  imageUrl: string
) => {
  try {
    return await adminApiClient.delete(`/products/admin/${productId}/images`, {
      imageUrl,
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw new Error("Failed to delete product image");
  }
};

export const listCollections = async () => {
  try {
    return await adminApiClient.get("/collections");
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const createCollection = async (collection: { title: string }) => {
  try {
    const result = await adminApiClient.post("/collections", collection);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw new Error("Failed to create collection");
  }
};

export const updateCollection = async (
  id: number,
  collection: { title: string }
) => {
  try {
    const result = await adminApiClient.put(`/collections/${id}`, collection);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw new Error("Failed to update collection");
  }
};

export const deleteCollection = async (id: number) => {
  try {
    const result = await adminApiClient.delete(`/collections/${id}`);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new Error("Failed to delete collection");
  }
};

export const listCategories = async () => {
  try {
    return await adminApiClient.get("/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (category: any) => {
  try {
    const result = await adminApiClient.post("/categories", category);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

export const updateCategory = async (id: number, category: any) => {
  try {
    const result = await adminApiClient.put(`/categories/${id}`, category);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const result = await adminApiClient.delete(`/categories/${id}`);
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

export const listPayments = async () => {
  try {
    return await adminApiClient.get("/admin/payments");
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: string
) => {
  try {
    const result = await adminApiClient.put(
      `/admin/payments/${paymentId}/status`,
      {
        status,
      }
    );
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const getPaymentStats = async () => {
  try {
    return await adminApiClient.get("/admin/payments/stats");
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return {
      pendingCount: 0,
      completedCount: 0,
      totalRevenue: 0,
    };
  }
};

export const createTestOrder = async () => {
  try {
    const result = await adminApiClient.post("/admin/orders/test");
    await clearDashboardCache(); // Clear cache when data changes
    return result;
  } catch (error) {
    console.error("Error creating test order:", error);
    throw error;
  }
};

export const listShipments = async () => {
  try {
    // For now, we'll use orders data to simulate shipments
    const orders = (await listOrders()) as any[];
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
    return await adminApiClient.get("/products");
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
