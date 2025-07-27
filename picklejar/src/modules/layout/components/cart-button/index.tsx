import { retrieveCart } from "@lib/data/cart";
import CartDropdown from "../cart-dropdown";

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export default async function CartButton() {
  const userId = getUserIdFromSession();
  let cart = null;

  if (userId) {
    try {
      cart = await retrieveCart(userId);
    } catch (error) {
      console.error("Error retrieving cart:", error);
      cart = null;
    }
  }

  return <CartDropdown cart={cart} />;
}
