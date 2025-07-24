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
): Promise<Wishlist> => {
  const res = await api.post("/wishlist/add", null, {
    params: { userId, productId },
  });
  return res.data;
};

export const removeFromWishlist = async (
  userId: number,
  productId: number
): Promise<Wishlist> => {
  const res = await api.delete("/wishlist/remove", {
    params: { userId, productId },
  });
  return res.data;
};

export const getWishlist = async (userId: number): Promise<Wishlist> => {
  const res = await api.get("/wishlist", { params: { userId } });
  return res.data;
};
