"use server";

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Wishlist = {
  id: number;
  user: { id: number; fullName: string; email: string };
  products: Array<{
    id: number;
    name: string;
    price: number;
    imageUrls: string[];
    stock: number;
  }>;
};

export const addToWishlist = async (
  userId: number,
  productId: number
): Promise<Wishlist | null> => {
  try {
    const res = await api.post("/wishlist/add", null, {
      params: { userId, productId },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return null;
  }
};

export const removeFromWishlist = async (
  userId: number,
  productId: number
): Promise<Wishlist | null> => {
  try {
    const res = await api.delete("/wishlist/remove", {
      params: { userId, productId },
    });
    return res.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return null;
  }
};

export const getWishlist = async (userId: number): Promise<Wishlist | null> => {
  try {
    const res = await api.get("/wishlist", { params: { userId } });
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }
};
