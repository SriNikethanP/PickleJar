"use client";

import { assignCart } from "@lib/data/cart";
import { ExclamationCircleSolid } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { useState } from "react";
import { toast } from "sonner";

function CartMismatchBanner(props: {
  customer: { id: number };
  cart: { id: number; customer_id?: number };
}) {
  const { customer, cart } = props;
  const [isPending, setIsPending] = useState(false);
  const [actionText, setActionText] = useState("Run transfer again");

  if (!customer || !!cart.customer_id) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      setActionText("Transferring..");
      await assignCart(cart.id, customer.id);
      toast.success("Cart transferred successfully!");
      setActionText("Transferred!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to transfer cart.");
      setActionText("Run transfer again");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center small:p-4 p-2 text-center bg-orange-300 small:gap-2 gap-1 text-sm mt-2 text-orange-800">
      <div className="flex flex-col small:flex-row small:gap-2 gap-1 items-center">
        <span className="flex items-center gap-1">
          <ExclamationCircleSolid className="inline" />
          Something went wrong when we tried to transfer your cart
        </span>
        <span>·</span>
        <Button
          variant="transparent"
          className="hover:bg-transparent active:bg-transparent focus:bg-transparent disabled:text-orange-500 text-orange-950 p-0 bg-transparent"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}

export default CartMismatchBanner;
