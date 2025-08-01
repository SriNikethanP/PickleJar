import { adminApiClient } from "@lib/admin-api";

export const getAdminDashboardData = async (): Promise<any> => {
  try {
    const [sales, orders, customers, pie, trend, timeline] = await Promise.all([
      adminApiClient.get("/admin/reports/total-sales"),
      adminApiClient.get("/admin/reports/total-orders"),
      adminApiClient.get("/admin/reports/total-customers"),
      adminApiClient.get("/admin/reports/category-distribution"),
      adminApiClient.get("/admin/reports/revenue-trend"),
      adminApiClient.get("/admin/reports/monthly-revenue-timeline"),
    ]);

    return {
      totalSales: sales || 0,
      totalOrders: orders || 0,
      totalCustomers: customers || 0,
      categoryPieData: pie || [],
      trendLabels: ((trend as any[]) || []).map((d: any) => d.date),
      revenueTrend: ((trend as any[]) || []).map((d: any) => d.revenue),
      revenueTimeline: timeline || [],
    };
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
};

export const listOrders = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/orders");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const listCustomers = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/users");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getOrderCount = async (userId: number) => {
  try {
    const res = await adminApiClient.get(`/admin/users/${userId}/orders`);
    return Array.isArray(res) ? res.length : 0;
  } catch (error) {
    console.error("Error fetching order count:", error);
    return 0;
  }
};

export const addProduct = async (product: any, images: File[] = []) => {
  try {
    let imageUrls: string[] = [];
    // Upload images to Cloudinary if provided
    if (images.length > 0) {
      // const cloudinaryResults = await uploadMultipleImagesToCloudinary(images); // This line was removed as per the new_code
      // imageUrls = cloudinaryResults.map((result) => result.secure_url); // This line was removed as per the new_code
    }
    // Send product data with Cloudinary URLs to backend
    const productData = {
      name: product.name,
      description: product.description,
      // categoryName: product.categoryName,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
      stock: product.stock,
      imageUrls: imageUrls, // Send Cloudinary URLs instead of files
    };
    const res = await adminApiClient.post("/products/admin", productData);
    return res;
  } catch (error: any) {
    console.error("Error adding product:", error);

    // Handle specific validation errors from backend
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.error) {
        throw new Error(errorData.error);
      } else if (typeof errorData === "string") {
        throw new Error(errorData);
      }
    }

    // Handle foreign key constraint errors
    if (error.response?.status === 500) {
      const errorMessage =
        error.response.data?.message || error.response.data?.error;
      if (
        errorMessage &&
        errorMessage.includes("foreign key constraint fails")
      ) {
        if (errorMessage.includes("category_id")) {
          throw new Error(
            "Selected category does not exist. Please choose a valid category."
          );
        } else if (errorMessage.includes("collection_id")) {
          throw new Error(
            "Selected collection does not exist. Please choose a valid collection."
          );
        }
      }
    }

    throw error;
  }
};

export const updateProduct = async (
  id: number,
  product: any,
  images: File[] = []
) => {
  try {
    let imageUrls: string[] = [];
    // Upload images to Cloudinary if provided
    if (images.length > 0) {
      // const cloudinaryResults = await uploadMultipleImagesToCloudinary(images); // This line was removed as per the new_code
      // imageUrls = cloudinaryResults.map((result) => result.secure_url); // This line was removed as per the new_code
    }
    // Send product data with Cloudinary URLs to backend
    const productData = {
      name: product.name,
      description: product.description,
      categoryName: product.categoryName,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
      stock: product.stock,
      imageUrls: imageUrls, // Send Cloudinary URLs instead of files
    };
    const res = await adminApiClient.put(`/products/admin/${id}`, productData);
    return res;
  } catch (error: any) {
    console.error("Error updating product:", error);

    // Handle specific validation errors from backend
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.error) {
        throw new Error(errorData.error);
      } else if (typeof errorData === "string") {
        throw new Error(errorData);
      }
    }

    // Handle foreign key constraint errors
    if (error.response?.status === 500) {
      const errorMessage =
        error.response.data?.message || error.response.data?.error;
      if (
        errorMessage &&
        errorMessage.includes("foreign key constraint fails")
      ) {
        if (errorMessage.includes("category_id")) {
          throw new Error(
            "Selected category does not exist. Please choose a valid category."
          );
        } else if (errorMessage.includes("collection_id")) {
          throw new Error(
            "Selected collection does not exist. Please choose a valid collection."
          );
        }
      }
    }

    throw error;
  }
};

// Delete a product image from Cloudinary via backend
export const deleteProductImage = async (
  productId: number,
  imageUrl: string
) => {
  try {
    const res = await adminApiClient.delete(
      `/products/admin/${productId}/images`,
      {
        data: { imageUrl },
      }
    );
    return res;
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};

// Delete an entire product (which should also delete its images)
export const deleteProduct = async (productId: number) => {
  try {
    const res = await adminApiClient.delete(`/products/admin/${productId}`);
    return res;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const listCollections = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/collections");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const getCollection = async (id: number) => {
  try {
    const res = await adminApiClient.get(`/admin/collections/${id}`);
    return res;
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
};

export const createCollection = async (collection: { title: string }) => {
  try {
    const res = await adminApiClient.post("/admin/collections", {
      title: collection.title,
    });
    return res;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const updateCollection = async (
  id: number,
  collection: { title: string }
) => {
  try {
    const res = await adminApiClient.put(`/admin/collections/${id}`, {
      title: collection.title,
    });
    return res;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

export const deleteCollection = async (id: number) => {
  try {
    const res = await adminApiClient.delete(`/admin/collections/${id}`);
    return res;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export const listCategories = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/categories");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategory = async (id: number) => {
  try {
    const res = await adminApiClient.get(`/admin/categories/${id}`);
    return res;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const createCategory = async (category: any) => {
  try {
    const res = await adminApiClient.post("/admin/categories", category);
    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id: number, category: any) => {
  try {
    const res = await adminApiClient.put(`/admin/categories/${id}`, category);
    return res;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const res = await adminApiClient.delete(`/admin/categories/${id}`);
    return res;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const listPayments = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/admin/payments");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const listShipments = async (): Promise<any[]> => {
  try {
    // TODO: Implement shipments endpoint in backend
    // For now, return empty array since shipments endpoint doesn't exist
    console.warn("Shipments endpoint not implemented in backend yet");
    return [];
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
};

export const listInventory = async (): Promise<any[]> => {
  try {
    const result = await adminApiClient.get("/products/admin");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
