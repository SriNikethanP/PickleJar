import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import CartTemplate from "@modules/cart/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export default async function Cart() {
  const userId = getUserIdFromSession();
  let cart = null;
  let customer = null;

  if (userId) {
    try {
      cart = await retrieveCart(userId);
      customer = await retrieveCustomer(userId);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }

  return <CartTemplate cart={cart} customer={customer} />;
}
