import { Metadata } from "next";

import Overview from "@modules/account/components/overview";
import { notFound } from "next/navigation";
import { retrieveCustomer } from "@lib/data/customer";
import { listOrders } from "@lib/data/orders";

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
};

export default async function OverviewTemplate() {
  // Placeholder userId, replace with actual user/session logic
  const userId = 1;

  let customer = null;
  let orders = null;

  try {
    customer = await retrieveCustomer(userId);
    orders = await listOrders();
  } catch (error) {
    console.error("Error fetching account data:", error);
  }

  if (!customer) {
    notFound();
  }

  return <Overview customer={customer} orders={orders} />;
}
