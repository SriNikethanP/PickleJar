import { AdminNavbar } from "./components/AdminNavbar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
} 