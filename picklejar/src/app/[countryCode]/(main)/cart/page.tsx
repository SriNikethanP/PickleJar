import ClientCart from "./ClientCart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default function Cart() {
  return <ClientCart />;
}
