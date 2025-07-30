import { uploadMultipleFilesAsBase64ToCloudinary } from "@lib/util/cloudinary";
import { adminApiClient } from "@lib/admin-api";
import { measureAsync } from "@lib/util/performance";

// Simple cache for dashboard data
let dashboardCache: any = null;
let dashboardCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getAdminDashboardData = async (): Promise<any> => {
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
        totalSales: sales || 0,
        totalOrders: orders || 0,
        totalCustomers: customers || 0,
        categoryPieData: pie || [],
        trendLabels: ((trend as any[]) || []).map((d: any) => d.date),
        revenueTrend: ((trend as any[]) || []).map((d: any) => d.revenue),
        revenueTimeline: timeline || [],
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
export const clearDashboardCache = async (): Promise<void> => {
  dashboardCache = null;
  dashboardCacheTime = 0;
};

export const listOrders = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/orders");
    return result || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const listCustomers = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/users");
    return result || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getOrderCount = async (userId: number): Promise<number> => {
  try {
    const res = await adminApiClient.get(`/admin/users/${userId}/orders`);
    return ((res as any[]) || []).length;
  } catch (error) {
    console.error("Error fetching order count:", error);
    return 0;
  }
};

export const addProduct = async (
  product: any,
  images: File[] = []
): Promise<any> => {
  try {
    let imageUrls: string[] = [];
    if (images.length > 0) {
      const cloudinaryResults = await uploadMultipleFilesAsBase64ToCloudinary(
        images
      );
      imageUrls = cloudinaryResults.map((result) => result.secure_url);
    }

    const productData = {
      ...product,
      imageUrls,
    };

    const result = await adminApiClient.post("/admin/products", productData);
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  product: any,
  images: File[] = []
): Promise<any> => {
  try {
    let imageUrls: string[] = [];
    if (images.length > 0) {
      const cloudinaryResults = await uploadMultipleFilesAsBase64ToCloudinary(
        images
      );
      imageUrls = cloudinaryResults.map((result) => result.secure_url);
    }

    const productData = {
      ...product,
      imageUrls,
    };

    const result = await adminApiClient.put(
      `/admin/products/${id}`,
      productData
    );
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await adminApiClient.delete(`/admin/products/${productId}`);
    await clearDashboardCache();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const deleteProductImage = async (
  productId: number,
  imageUrl: string
): Promise<void> => {
  try {
    await adminApiClient.delete(`/admin/products/${productId}/images`, {
      imageUrl,
    });
    await clearDashboardCache();
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};

export const listCollections = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/collections");
    return result || [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const createCollection = async (collection: {
  title: string;
}): Promise<any> => {
  try {
    const result = await adminApiClient.post("/admin/collections", collection);
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const updateCollection = async (
  id: number,
  collection: { title: string }
): Promise<any> => {
  try {
    const result = await adminApiClient.put(
      `/admin/collections/${id}`,
      collection
    );
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

export const deleteCollection = async (id: number): Promise<void> => {
  try {
    await adminApiClient.delete(`/admin/collections/${id}`);
    await clearDashboardCache();
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export const listCategories = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/categories");
    return result || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (category: any): Promise<any> => {
  try {
    const result = await adminApiClient.post("/admin/categories", category);
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  category: any
): Promise<any> => {
  try {
    const result = await adminApiClient.put(
      `/admin/categories/${id}`,
      category
    );
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await adminApiClient.delete(`/admin/categories/${id}`);
    await clearDashboardCache();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const listPayments = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/payments");
    return result || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: string
): Promise<any> => {
  try {
    const result = await adminApiClient.put(
      `/admin/payments/${paymentId}/status`,
      {
        status,
      }
    );
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const getPaymentStats = async (): Promise<any> => {
  try {
    const result = await adminApiClient.get("/admin/payments/stats");
    return (
      result || {
        totalPayments: 0,
        pendingPayments: 0,
        completedPayments: 0,
        failedPayments: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return {
      totalPayments: 0,
      pendingPayments: 0,
      completedPayments: 0,
      failedPayments: 0,
    };
  }
};

export const createTestOrder = async (): Promise<any> => {
  try {
    const result = await adminApiClient.post("/admin/test-order");
    await clearDashboardCache();
    return result;
  } catch (error) {
    console.error("Error creating test order:", error);
    throw error;
  }
};

export const listShipments = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/shipments");
    return result || [];
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
};

export const listInventory = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/products");
    return result || [];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
