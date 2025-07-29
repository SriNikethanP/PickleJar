"use client";

import { useState } from "react";
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
  const [userDetails, setUserDetails] = useState<any>(null);

  if (!cart) {
    return null;
  }

  const handleAddressComplete = (address: any) => {
    setUserDetails(address);
  };

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping
        cart={cart}
        userDetails={userDetails}
        onAddressComplete={handleAddressComplete}
      />

      <Payment cart={cart} userDetails={userDetails} />

      <Review cart={cart} userDetails={userDetails} />
    </div>
  );
}
