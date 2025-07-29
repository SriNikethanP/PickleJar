"use client";

import { convertToLocale } from "@lib/util/money";
import React from "react";

type CartTotalsProps = {
  totals: any;
};

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  // Calculate totals from cart items
  const subtotal =
    totals?.items?.reduce((acc: number, item: any) => {
      // Handle cases where item.product might be undefined or missing price
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return acc + (price * quantity);
    }, 0) || 0;

  const shipping = 0; // Free shipping for now
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal (excl. shipping and taxes)
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal}>
            ₹{subtotal}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping}>
            ₹{shipping}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax}>
            ₹{tax}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total}
        >
          ₹{total}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  );
};

export default CartTotals;
