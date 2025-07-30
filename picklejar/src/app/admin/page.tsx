"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardData } from "@lib/data/admin-new";
import AdminDashboardClient from "./AdminDashboardClient";
import { useAdminAuth } from "@lib/context/admin-auth-context";

export default function AdminDashboard() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (admin) {
        try {
          const dashboardData = await getAdminDashboardData();
          setData(dashboardData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
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

  return <AdminDashboardClient data={data} />;
}
