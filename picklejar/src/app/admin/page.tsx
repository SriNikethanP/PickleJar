"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminDashboardData } from "@lib/data/admin-new";
import AdminDashboardClient from "./AdminDashboardClient";
import { useAdminAuth } from "@lib/context/admin-auth-context";
import LoadingSpinner from "components/LoadingSpinner";

export default function AdminDashboard() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
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
  }, [admin, authLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!admin) {
    return null; // Will be handled by ProtectedAdminRoute
  }

  return <AdminDashboardClient data={data} />;
}
