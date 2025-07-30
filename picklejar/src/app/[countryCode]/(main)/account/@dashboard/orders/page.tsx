"use client";

import { useAuth } from "@lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OrderOverview from "@modules/account/components/order-overview";
import Divider from "@modules/common/components/divider";
import { apiClient } from "@lib/api";
import { CustomOrder } from "@lib/data/orders";

// Transform backend OrderDTO to frontend CustomOrder format
const transformOrderData = (backendOrder: any): CustomOrder => {
  console.log("Transforming order:", backendOrder);

  return {
    id: backendOrder.id,
    display_id: backendOrder.id, // Use id as display_id
    total: backendOrder.totalAmount,
    currency_code: "INR", // Default to INR for now
    created_at: backendOrder.placedAt,
    items:
      backendOrder.items?.map((item: any) => {
        console.log("Transforming order item:", item);
        return {
          id: item.id,
          title: item.product?.name || "Unknown Product",
          quantity: item.quantity,
          thumbnail: item.product?.imageUrls?.[0] || null,
          price: item.priceAtOrder,
          // Add more product details if needed
          product: {
            id: item.product?.id,
            name: item.product?.name,
            description: item.product?.description,
            imageUrls: item.product?.imageUrls || [],
            price: item.product?.price,
            stock: item.product?.stock,
            categoryName: item.product?.categoryName,
            averageRating: item.product?.averageRating,
          },
        };
      }) || [],
    status: backendOrder.status || "PLACED",
    payment_method: backendOrder.paymentMethod,
    shipping_address: backendOrder.shippingAddress,
    customer_name: backendOrder.customerName,
    customer_email: backendOrder.customerEmail,
    customer_phone: backendOrder.customerPhone,
  };
};

export default function Orders() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<CustomOrder[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch orders when user is authenticated
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const ordersData = await apiClient.get<any[]>("/users/me/orders");
        console.log("Orders data received:", ordersData);

        // Validate that ordersData is an array and transform the data
        if (Array.isArray(ordersData)) {
          const transformedOrders = ordersData.map(transformOrderData);
          console.log("Transformed orders:", transformedOrders);
          setOrders(transformedOrders);
        } else {
          console.warn("Orders data is not an array:", ordersData);
          setOrders([]);
        }
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
