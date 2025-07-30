"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { Button } from "@lib/components/ui/button";
import { listShipments } from "@lib/data/admin";
import { useAdminAuth } from "@lib/context/admin-auth-context";

export default function ShippingPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      if (admin) {
        try {
          const shipmentsData = await listShipments();
          setShipments(shipmentsData as any[]);
        } catch (error) {
          console.error("Error fetching shipments:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading) {
        setIsLoading(false);
      }
    };

    fetchShipments();
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
        <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
        <p className="text-gray-600">
          Manage shipping methods and delivery tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Shipping Methods</CardTitle>
              <Button>Add Method</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Standard Delivery
                    </h4>
                    <p className="text-sm text-gray-500">3-5 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹50</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Express Delivery
                    </h4>
                    <p className="text-sm text-gray-500">1-2 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹150</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries ({shipments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipments.length > 0 ? (
                shipments.slice(0, 5).map((shipment: any) => (
                  <div
                    key={shipment.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Order #{shipment.orderId}
                      </h4>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          shipment.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {shipment.status === "Delivered"
                        ? `Delivered on: ${new Date(
                            shipment.deliveredAt
                          ).toLocaleDateString()}`
                        : `Expected delivery: ${new Date(
                            shipment.shippedAt
                          ).toLocaleDateString()}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tracking: {shipment.trackingNumber}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No shipments found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
