"use client";

import { Button, Heading } from "@medusajs/ui";

import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type SummaryProps = {
  cart: any;
};

function getCheckoutStep(cart: any) {
  // For now, always go to address step
  return "address";
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart);

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  );
};

export default Summary;
