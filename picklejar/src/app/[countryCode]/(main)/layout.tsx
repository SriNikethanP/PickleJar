import { Metadata } from "next";

import { listCartOptions, retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { getBaseURL } from "@lib/util/env";
import { StoreCartShippingOption } from "@medusajs/types";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const userId = getUserIdFromSession();
  let customer = null;
  let cart = null;
  let shippingOptions: StoreCartShippingOption[] = [];

  if (userId) {
    customer = await retrieveCustomer(userId);
    cart = await retrieveCart(userId);
    if (cart) {
      try {
        const { shipping_options } = await listCartOptions();
        shippingOptions = shipping_options;
      } catch (error) {
        console.error("Error fetching cart options:", error);
      }
    }
  }

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
    </>
  );
}
