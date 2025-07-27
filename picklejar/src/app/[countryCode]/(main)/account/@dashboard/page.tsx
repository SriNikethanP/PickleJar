import { Metadata } from "next";

import Overview from "@modules/account/components/overview";
import { notFound } from "next/navigation";
import { retrieveCustomer } from "@lib/data/customer";
import { listOrders } from "@lib/data/orders";

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
};

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export default async function OverviewTemplate() {
  const userId = getUserIdFromSession();
  let customer = null;
  let orders = null;

  if (userId) {
    try {
      customer = await retrieveCustomer(userId);
      orders = await listOrders();
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  }

  if (!customer) {
    notFound();
  }

  return <Overview customer={customer} orders={orders} />;
}
