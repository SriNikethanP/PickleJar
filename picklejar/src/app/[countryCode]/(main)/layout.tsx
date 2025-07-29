import { Metadata } from "next";

import { Cart, listCartOptions, retrieveCart } from "@lib/data/cart";
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

export default async function PageLayout(props: { children: React.ReactNode }) {
  let customer = null;
  let cart = null;
  let shippingOptions: StoreCartShippingOption[] = [];

  try {
    customer = await retrieveCustomer();
    cart = await retrieveCart();

    if (cart) {
      try {
        const { shipping_options } = await listCartOptions();
        shippingOptions = shipping_options || [];
      } catch (error) {
        console.error("Error fetching cart options:", error);
        shippingOptions = [];
      }
    }
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    // If it's an authentication error, just continue without user/cart data
    // The client-side components will handle authentication
    if (error.message === "Authentication required") {
      customer = null;
      cart = null;
      shippingOptions = [];
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
