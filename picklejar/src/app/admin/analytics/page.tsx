
import { getAdminDashboardData } from "@lib/data/admin";
import AnalyticsClient from "../AnalyticsClient";

export default async function AnalyticsPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">View detailed analytics and insights</p>
      </div>

      <AnalyticsClient data={data} />
    </div>
  );
}
