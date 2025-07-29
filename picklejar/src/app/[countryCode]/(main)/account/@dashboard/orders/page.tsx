"use client";

import { useAuth } from "@lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OrderOverview from "@modules/account/components/order-overview";
import Divider from "@modules/common/components/divider";
import { apiClient } from "@lib/api";

export default function Orders() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    router.push("/account");
    return null;
  }

  // Fetch orders when user is authenticated
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const ordersData = await apiClient.get<any[]>("/users/me/orders");
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (ordersLoading) {
    return (
      <div className="w-full" data-testid="orders-page-wrapper">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl-semi">Orders</h1>
          <p className="text-base-regular">
            View your previous orders and their status. You can also create
            returns or exchanges for your orders if needed.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Orders</h1>
        <p className="text-base-regular">
          View your previous orders and their status. You can also create
          returns or exchanges for your orders if needed.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders || []} />
        {/* <Divider className="my-16" /> */}
        {/* <TransferRequestForm /> */}
      </div>
    </div>
  );
}
