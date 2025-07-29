"use client";

import { Toaster } from "@medusajs/ui";
import AccountLayout from "@modules/account/templates/account-layout";
import { useAuth } from "@lib/context/auth-context";

export default function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode;
  login?: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AccountLayout customer={null}>
      {user ? dashboard : login}
      <Toaster />
    </AccountLayout>
  );
}
