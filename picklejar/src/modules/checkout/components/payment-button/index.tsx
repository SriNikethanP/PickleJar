"use client";

import { Button } from "@medusajs/ui";
import { toast } from "sonner";
import React, { useState } from "react";
import ErrorMessage from "../error-message";
import { codCheckout } from "@lib/client-cart";

type PaymentButtonProps = {
  cart: any;
  userDetails?: any;
  "data-testid": string;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  userDetails,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const notReady =
    !cart || !cart.items || cart.items.length === 0 || !userDetails;

  const handleCODPayment = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await codCheckout({
        cartId: cart?.id,
        ...userDetails,
      });

      if (result) {
        toast.success("COD order placed successfully!");
        // Redirect to order confirmation or home page
        window.location.href = "/";
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to place COD order");
      toast.error(error.message || "Failed to place COD order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        disabled={notReady}
        onClick={handleCODPayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place COD Order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="cod-payment-error-message"
      />
    </>
  );
};

// COD-only payment button component

export default PaymentButton;
