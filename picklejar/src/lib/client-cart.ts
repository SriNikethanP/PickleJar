"use client";

import { apiClient } from "@lib/api";
import { toast } from "sonner";

export type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  stock: number;
};

export type Cart = {
  cartId: number;
  items: CartItem[];
  subtotal: number;
  shippingCharges: number;
  gstTax: number;
  total: number;
};

// Get cart for current authenticated user
export const getCurrentUserCart = async (): Promise<Cart | null> => {
  try {
    return await apiClient.get("/cart");
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Authentication required");
    }
    return null;
  }
};

// Add item to cart for current authenticated user
export const addToCart = async (
  productId: number,
  quantity: number
): Promise<Cart | null> => {
  try {
    const result = await apiClient.post<Cart>("/cart", { productId, quantity });
    toast.success("Added to cart successfully!");
    return result;
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    toast.error(error.message || "Failed to add to cart");
    return null;
  }
};

// Update cart item quantity for current authenticated user
export const updateCartItem = async (
  cartItemId: number,
  quantity: number
): Promise<Cart | null> => {
  try {
    const result = await apiClient.put<Cart>("/cart/item", {
      cartItemId,
      quantity,
    });
    if (quantity > 0) {
      toast.success("Cart updated successfully!");
    } else {
      toast.success("Item removed from cart!");
    }
    return result;
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    toast.error(error.message || "Failed to update cart");
    return null;
  }
};

// Remove item from cart for current authenticated user
export const removeCartItem = async (
  cartItemId: number
): Promise<Cart | null> => {
  try {
    const result = await apiClient.delete<Cart>(
      `/cart/item?cartItemId=${cartItemId}`
    );
    toast.success("Item removed from cart!");
    return result;
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    toast.error(error.message || "Failed to remove item");
    return null;
  }
};

// Checkout cart for current authenticated user
export const checkoutCart = async () => {
  try {
    const result = await apiClient.post("/cart/checkout");
    toast.success("Checkout successful!");
    return result;
  } catch (error: any) {
    console.error("Error checking out cart:", error);
    toast.error(error.message || "Failed to checkout");
    return null;
  }
};

// COD Checkout for current authenticated user
export const codCheckout = async (userDetails: any) => {
  try {
    console.log("COD Checkout - userDetails:", userDetails);
    console.log(
      "COD Checkout - accessToken:",
      localStorage.getItem("accessToken")
    );

    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("User not authenticated. Please log in first.");
    }

    console.log("COD Checkout - Making request to /cart/checkout/cod");
    const result = await apiClient.post("/cart/checkout/cod", userDetails);
    console.log("COD Checkout - Success response:", result);
    toast.success("COD order placed successfully!");
    return result;
  } catch (error: any) {
    console.error("Error during COD checkout:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.message.includes("not authenticated")) {
      toast.error("Please log in to complete your order");
    } else {
      toast.error(error.message || "COD checkout failed");
    }
    return null;
  }
};

// Wrapper function for adding to cart (compatible with existing interface)
export const addToCartWrapper = async ({
  productId,
  quantity,
  countryCode,
}: {
  productId: number;
  quantity: number;
  countryCode: string;
}) => {
  const result = await addToCart(productId, quantity);
  if (!result) {
    throw new Error("Failed to add to cart");
  }
  return result;
};

// Wrapper function for updating line item (compatible with existing interface)
export const updateLineItem = async ({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) => {
  const result = await updateCartItem(parseInt(lineId), quantity);
  if (!result) {
    throw new Error("Failed to update cart item");
  }
  return result;
};
