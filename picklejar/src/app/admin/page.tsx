import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { getAdminDashboardData } from "@lib/data/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  return <AdminDashboardClient data={data} />;
}
