"use client";

import { useCart } from "@lib/context/cart-context";
import { useAuth } from "@lib/context/auth-context";
import CartTemplate from "@modules/cart/templates";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "components/LoadingSpinner";

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
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <CartTemplate cart={cart} customer={user} />;
}
