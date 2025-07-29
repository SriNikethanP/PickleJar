"use client";

import { useAuth } from "@lib/context/auth-context";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // The parallel routes will handle showing the correct content
  // @dashboard will show when user is authenticated
  // @login will show when user is not authenticated
  return null;
}
