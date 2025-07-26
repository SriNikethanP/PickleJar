"use server";

import axios from "axios";
import type { Product } from "./products";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Category = {
  id: number;
  name: string;
  products: Product[];
};

export const listCategories = async (): Promise<Category[]> => {
  try {
    const res = await api.get("/categories");
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryByHandle = async (
  categoryHandle: string[]
): Promise<Category | null> => {
  try {
    const categoryName = categoryHandle.join("/");
    const res = await api.get("/categories", {
      params: { name: categoryName },
    });
    return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
  } catch (error) {
    console.error("Error fetching category by handle:", error);
    return null;
  }
};
