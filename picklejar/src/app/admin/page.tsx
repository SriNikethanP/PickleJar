
import { getAdminDashboardData } from "@lib/data/admin-new";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  return <AdminDashboardClient data={data} />;
}
