import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import CartTemplate from "@modules/cart/templates";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default async function Cart() {
  // Placeholder userId, replace with actual user/session logic
  const userId = 1;
  const cart = await retrieveCart(userId).catch((error) => {
    console.error(error);
    return notFound();
  });

  const customer = await retrieveCustomer(userId);

  return <CartTemplate cart={cart} customer={customer} />;
}
