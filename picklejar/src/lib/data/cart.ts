"use server";

import axios from "axios";
import { getAuthHeaders } from "./cookies";

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

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export const getCartByUserId = async (userId: number): Promise<Cart | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.get("/cart", {
      params: { userId },
      headers: authHeaders,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching cart by user ID:", error);
    return null;
  }
};

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<Cart | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.post(
      "/cart",
      { productId, quantity },
      {
        params: { userId },
        headers: authHeaders,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number
): Promise<Cart | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.put(
      "/cart/item",
      { cartItemId, quantity },
      {
        params: { userId },
        headers: authHeaders,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
};

// Wrapper function for cart item component
export const updateLineItem = async ({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) => {
  const userId = getUserIdFromSession();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const result = await updateCartItem(userId, parseInt(lineId), quantity);
  if (!result) {
    throw new Error("Failed to update cart item");
  }
  return result;
};

// Wrapper function for adding to cart (compatible with Medusa interface)
export const addToCartWrapper = async ({
  productId,
  quantity,
  countryCode,
}: {
  productId: number;
  quantity: number;
  countryCode: string;
}) => {
  const userId = getUserIdFromSession();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const result = await addToCart(userId, productId, quantity);
  if (!result) {
    throw new Error("Failed to add to cart");
  }
  return result;
};

export const removeCartItem = async (
  userId: number,
  cartItemId: number
): Promise<Cart | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.delete("/cart/item", {
      params: { userId, cartItemId },
      headers: authHeaders,
    });
    return res.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return null;
  }
};

export const checkoutCart = async (userId: number) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.post("/cart/checkout", null, {
      params: { userId },
      headers: authHeaders,
    });
    return res.data;
  } catch (error) {
    console.error("Error checking out cart:", error);
    return null;
  }
};

export const assignCart = async (cartId: number, customerId: number) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.put(
      "/cart/assign",
      { cartId, customerId },
      {
        headers: authHeaders,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error assigning cart:", error);
    return null;
  }
};

export const retrieveCart = async (userId: number): Promise<Cart | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.get("/cart", {
      params: { userId },
      headers: authHeaders,
    });
    return res.data;
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return null;
  }
};

export const listCartOptions = async () => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await api.get("/shipping-options", {
      headers: authHeaders,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching cart options:", error);
    return { shipping_options: [] };
  }
};
