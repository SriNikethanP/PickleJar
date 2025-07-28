"use client";

import { useCart } from "@lib/context/cart-context";
import CartDropdown from "../cart-dropdown";

export default function ClientCartButton() {
  const { cart, isLoading, cartItemCount } = useCart();

  if (isLoading) {
    return (
      <div className="flex items-center gap-x-2 text-gray-700 hover:text-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span className="hidden md:block">Loading...</span>
      </div>
    );
  }

  return <CartDropdown cart={cart} />;
}
