"use server";

import axios from "axios";
import { measureAsync } from "@lib/util/performance";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple cache for products data
let productsCache: any = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export type Product = {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  stock: number;
  reviews: any[];
  categoryName: string;
  averageRating: number;
};

export const getAllProducts = async (): Promise<Product[]> => {
  return measureAsync("getAllProducts", async () => {
    // Check cache first
    const now = Date.now();
    if (productsCache && now - productsCacheTime < CACHE_DURATION) {
      return productsCache;
    }

    try {
      const res = await api.get("/products");

      const products = Array.isArray(res.data)
        ? res.data.filter(
            (product: any): product is Product =>
              product.id &&
              product.name &&
              typeof product.name === "string" &&
              product.description &&
              typeof product.description === "string"
          )
        : [];

      // Cache the result
      productsCache = products;
      productsCacheTime = now;

      return products;
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return [];
    }
  });
};

// Clear cache when needed
export const clearProductsCache = async () => {
  productsCache = null;
  productsCacheTime = 0;
};

export const listProductsByCollection = async (
  collectionId: number
): Promise<Product[]> => {
  return measureAsync(`listProductsByCollection-${collectionId}`, async () => {
    try {
      const res = await api.get(`/collections/${collectionId}/products`);
      return Array.isArray(res.data)
        ? res.data.filter(
            (product: any): product is Product =>
              product.id &&
              product.name &&
              typeof product.name === "string" &&
              product.description &&
              typeof product.description === "string"
          )
        : [];
    } catch (error) {
      console.error("Error fetching products by collection:", error);
      return [];
    }
  });
};

export const getProduct = async (id: number): Promise<Product | null> => {
  return measureAsync(`getProduct-${id}`, async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const product = res.data;

      if (product && product.id && product.name && product.description) {
        return product as Product;
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  });
};
