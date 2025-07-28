import { AdminNavbar } from "./components/AdminNavbar";
import { AdminAuthProvider } from "@lib/context/admin-auth-context";
import ProtectedAdminRoute from "@lib/components/ProtectedAdminRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ProtectedAdminRoute>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <main className="p-6">{children}</main>
        </div>
      </ProtectedAdminRoute>
    </AdminAuthProvider>
  );
}
