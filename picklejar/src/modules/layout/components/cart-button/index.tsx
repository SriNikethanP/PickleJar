import { retrieveCart } from "@lib/data/cart";
import CartDropdown from "../cart-dropdown";

export default async function CartButton() {
  // Placeholder userId, replace with actual user/session logic
  const userId = 1;
  const cart = await retrieveCart(userId).catch(() => null);

  return <CartDropdown cart={cart} />;
}
