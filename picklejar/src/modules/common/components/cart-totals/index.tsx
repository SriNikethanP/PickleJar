"use client";

import { convertToLocale } from "@lib/util/money";
import React from "react";

type CartTotalsProps = {
  totals: any;
};

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  // Use the calculated totals from backend if available, otherwise calculate from items
  const subtotal =
    totals?.subtotal ||
    totals?.items?.reduce((acc: number, item: any) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return acc + price * quantity;
    }, 0) ||
    0;

  const shipping = totals?.shippingCharges || 0;
  const gstTax = totals?.gstTax || 0;
  const total = totals?.total || subtotal + shipping + gstTax;

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal (excl. shipping and taxes)
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal}>
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping}>
            {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">GST (18%)</span>
          <span data-testid="cart-taxes" data-value={gstTax}>
            ₹{gstTax.toFixed(2)}
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
          ₹{total.toFixed(2)}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
      {subtotal < 500 && (
        <div className="text-sm text-green-600 mt-2 text-center">
          Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
        </div>
      )}
    </div>
  );
};

export default CartTotals;
