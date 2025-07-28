"use client";

import { useAdminAuth } from "@lib/context/admin-auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedAdminRoute({
  children,
  fallback,
}: ProtectedAdminRouteProps) {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  if (!admin) {
    return null; // Will redirect to admin login
  }

  return <>{children}</>;
}
