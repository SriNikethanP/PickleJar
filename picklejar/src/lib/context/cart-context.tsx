"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@lib/context/auth-context";
import {
  getCurrentUserCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  Cart,
} from "@lib/client-cart";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<boolean>;
  removeCartItem: (cartItemId: number) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate cart item count
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchCart();
      } else {
        setCart(null);
        setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchCart = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const cartData = await getCurrentUserCart();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    try {
      const updatedCart = await addToCart(productId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to cart:", error);
      // The error toast is already handled in the addToCart function
      return false;
    }
  };

  const handleUpdateCartItem = async (
    cartItemId: number,
    quantity: number
  ): Promise<boolean> => {
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    try {
      const updatedCart = await updateCartItem(cartItemId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating cart item:", error);
      return false;
    }
  };

  const handleRemoveCartItem = async (cartItemId: number): Promise<boolean> => {
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    try {
      const updatedCart = await removeCartItem(cartItemId);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing cart item:", error);
      return false;
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeCartItem: handleRemoveCartItem,
    refreshCart,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
