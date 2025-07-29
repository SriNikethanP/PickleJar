import { Toaster } from "@medusajs/ui";
import AccountLayout from "@modules/account/templates/account-layout";

export default function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode;
  login?: React.ReactNode;
}) {
  return (
    <AccountLayout customer={null}>
      {login || dashboard}
      <Toaster />
    </AccountLayout>
  );
}
