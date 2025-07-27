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
  categoryName: string;
  averageRating: number;
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from:", api.defaults.baseURL);
    const res = await api.get("/products");
    console.log("Products response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);

    return [];
  }
};
