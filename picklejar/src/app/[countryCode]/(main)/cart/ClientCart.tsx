"use client";

import { useCart } from "@lib/context/cart-context";
import { useAuth } from "@lib/context/auth-context";
import CartTemplate from "@modules/cart/templates";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientCart() {
  const { cart, isLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/account/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <CartTemplate cart={cart} customer={user} />;
}
