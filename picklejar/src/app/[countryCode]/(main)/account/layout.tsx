import { retrieveCustomer } from "@lib/data/customer";
import { Toaster } from "@medusajs/ui";
import AccountLayout from "@modules/account/templates/account-layout";

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode;
  login?: React.ReactNode;
}) {
  // Placeholder userId, replace with actual user/session logic
  const userId = 1;
  let customer = null;

  try {
    customer = await retrieveCustomer(userId);
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  );
}
