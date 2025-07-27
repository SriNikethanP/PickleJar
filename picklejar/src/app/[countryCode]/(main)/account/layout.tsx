import { retrieveCustomer } from "@lib/data/customer";
import { Toaster } from "@medusajs/ui";
import AccountLayout from "@modules/account/templates/account-layout";

// Placeholder: Replace with real session/user logic
function getUserIdFromSession(): number | null {
  return null; // Return userId if logged in, otherwise null
}

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode;
  login?: React.ReactNode;
}) {
  const userId = getUserIdFromSession();
  let customer = null;

  if (userId) {
    try {
      customer = await retrieveCustomer(userId);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  }

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  );
}
