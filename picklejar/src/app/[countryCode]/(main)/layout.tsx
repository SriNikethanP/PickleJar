import { Metadata } from "next";
import { Suspense } from "react";

import { Cart, retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { getBaseURL } from "@lib/util/env";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";
import LoadingSpinner from "components/LoadingSpinner";
// import PerformanceMonitor from "components/PerformanceMonitor";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

// Async component for cart mismatch banner
async function CartMismatchBannerWrapper() {
  try {
    const [customer, cart] = await Promise.all([
      retrieveCustomer(),
      retrieveCart(),
    ]);

    if (customer && cart) {
      return <CartMismatchBanner customer={customer} cart={cart} />;
    }
    return null;
  } catch (error) {
    console.error("Error loading cart mismatch banner:", error);
    return null;
  }
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <CartMismatchBannerWrapper />
      </Suspense>

      {props.children}
      <Footer />
      {/* <PerformanceMonitor /> */}
    </>
  );
}
