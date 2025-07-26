"use server";

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Product = {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  stock: number;
  reviews: any[];
  category: { id: number; name: string } | null;
  active: boolean;
};

export const listProducts = async ({
  page = 1,
  limit = 12,
  sortBy = "createdAt",
  order = "desc",
  name,
  category,
  inStock,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  name?: string;
  category?: string;
  inStock?: boolean;
} = {}): Promise<{ products: Product[]; count: number }> => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      sortBy,
      order,
    };
    if (name) params.name = name;
    if (category) params.category = category;
    if (typeof inStock === "boolean") params.inStock = inStock;

    const res = await api.get("/products/search", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], count: 0 };
  }
};

export const listProductsByCollection = async (
  collectionId: number
): Promise<Product[]> => {
  try {
    const res = await api.get(`/collections/${collectionId}/products`);
    return res.data;
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    return [];
  }
};

export const listProductsWithSort = async ({
  page,
  queryParams,
  sortBy,
  countryCode,
}: {
  page: number;
  queryParams: Record<string, any>;
  sortBy?: string;
  countryCode: string;
}): Promise<{
  response: { products: Product[]; count: number };
}> => {
  try {
    const params = {
      page,
      limit: 12,
      sortBy: sortBy || "createdAt",
      order: "desc",
      ...queryParams,
    };

    const res = await api.get("/products/search", { params });
    return {
      response: {
        products: res.data.products || [],
        count: res.data.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching products with sort:", error);
    return {
      response: {
        products: [],
        count: 0,
      },
    };
  }
};
