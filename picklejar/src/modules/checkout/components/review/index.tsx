"use client";

import { Heading, Text, clx } from "@medusajs/ui";

import PaymentButton from "../payment-button";
import { useSearchParams } from "next/navigation";

const Review = ({ cart, userDetails }: { cart: any; userDetails?: any }) => {
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("step") === "review";

  // For COD flow, we need cart items and user details
  const previousStepsCompleted = cart?.items && cart.items.length > 0 && userDetails;

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} userDetails={userDetails} data-testid="submit-order-button" />
        </>
      )}
    </div>
  );
};

export default Review;
