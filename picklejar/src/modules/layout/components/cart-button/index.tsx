import { retrieveCart } from "@lib/data/cart";
import CartDropdown from "../cart-dropdown";

export default async function CartButton() {
  let cart = null;

  try {
    cart = await retrieveCart();
  } catch (error) {
    console.error("Error retrieving cart:", error);
    cart = null;
  }

  return <CartDropdown cart={cart} />;
}
