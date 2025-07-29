"use client";

import Addresses from "@modules/checkout/components/addresses";
import Payment from "@modules/checkout/components/payment";
import Review from "@modules/checkout/components/review";
import Shipping from "@modules/checkout/components/shipping";

export default function CheckoutForm({
  cart,
  customer,
}: {
  cart: any | null;
  customer: any | null;
}) {
  if (!cart) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} />

      <Payment cart={cart} />

      <Review cart={cart} userDetails={customer} />
    </div>
  );
}
