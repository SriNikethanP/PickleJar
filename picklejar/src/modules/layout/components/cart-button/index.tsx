import { retrieveCart } from "@lib/data/cart";
import CartDropdown from "../cart-dropdown";

export default async function CartButton() {
  let cart = null;

  cart = await retrieveCart();

  return <CartDropdown cart={cart} />;
}
