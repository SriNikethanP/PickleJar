import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type CartItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrls: string[];
    stock: number;
  };
  quantity: number;
};

export type Cart = {
  id: number;
  user: { id: number; fullName: string; email: string };
  items: CartItem[];
};

export const getCartByUserId = async (userId: number): Promise<Cart> => {
  const res = await api.get("/cart", { params: { userId } });
  return res.data;
};

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<Cart> => {
  const res = await api.post(
    "/cart",
    { productId, quantity },
    { params: { userId } }
  );
  return res.data;
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number
): Promise<Cart> => {
  const res = await api.put(
    "/cart/item",
    { cartItemId, quantity },
    { params: { userId } }
  );
  return res.data;
};

export const removeCartItem = async (
  userId: number,
  cartItemId: number
): Promise<Cart> => {
  const res = await api.delete("/cart/item", {
    params: { userId, cartItemId },
  });
  return res.data;
};

export const checkoutCart = async (userId: number) => {
  const res = await api.post("/cart/checkout", null, { params: { userId } });
  return res.data;
};
