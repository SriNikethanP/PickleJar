"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@lib/context/auth-context";
import { getCurrentUserCart } from "@lib/client-cart";
import PaymentWrapper from "@modules/checkout/components/payment-wrapper";
import CheckoutForm from "@modules/checkout/templates/checkout-form";
import CheckoutSummary from "@modules/checkout/templates/checkout-summary";
import { toast } from "sonner";

export default function CheckoutClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      if (!isAuthenticated()) {
        toast.error("Please log in to access checkout");
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const cartData = await getCurrentUserCart();

        if (!cartData) {
          toast.error("No cart found. Please add items to your cart first.");
          router.push("/store");
          return;
        }

        setCart(cartData);
        setCustomer(user);
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast.error("Failed to load checkout data. Please try again.");
        router.push("/store");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [user, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !customer) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  );
}
