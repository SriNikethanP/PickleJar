"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardData } from "@lib/data/admin";
import AnalyticsClient from "../AnalyticsClient";
import { useAdminAuth } from "@lib/context/admin-auth-context";

export default function AnalyticsPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (admin) {
        try {
          const dashboardData = await getAdminDashboardData();
          setData(dashboardData);
        } catch (error) {
          console.error("Error fetching analytics data:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [admin, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will be handled by ProtectedAdminRoute
  }

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
