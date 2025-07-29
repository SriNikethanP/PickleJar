import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function Checkout() {
  return <CheckoutClient />;
}
