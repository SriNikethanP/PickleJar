"use client";

import { AdminNavbar } from "./components/AdminNavbar";
import { AdminAuthProvider } from "@lib/context/admin-auth-context";
import ProtectedAdminRoute from "@lib/components/ProtectedAdminRoute";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        // Login page - no protection needed
        <div className="min-h-screen bg-gray-50">{children}</div>
      ) : (
        // Other admin pages - apply protection
        <ProtectedAdminRoute>
          <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <main className="p-6">{children}</main>
          </div>
        </ProtectedAdminRoute>
      )}
    </AdminAuthProvider>
  );
}
