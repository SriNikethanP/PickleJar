import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import CartTemplate from "@modules/cart/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default async function Cart() {
  // Placeholder userId, replace with actual user/session logic
  const userId = 1;

  let cart = null;
  let customer = null;

  try {
    cart = await retrieveCart(userId);
    customer = await retrieveCustomer(userId);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }

  return <CartTemplate cart={cart} customer={customer} />;
}
