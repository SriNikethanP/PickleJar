import { redirect } from "next/navigation";
import { retrieveCustomer } from "@lib/data/customer";

export default async function AccountPage() {
  // Check if user is authenticated
  const user = await retrieveCustomer();

  if (user) {
    // User is authenticated, show dashboard (parallel route will handle this)
    return null;
  } else {
    // User is not authenticated, show login (parallel route will handle this)
    return null;
  }
}
