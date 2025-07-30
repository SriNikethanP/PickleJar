"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lib/components/ui/table";
import { Button } from "@lib/components/ui/button";
import {
  listPayments,
  updatePaymentStatus,
  getPaymentStats,
  // createTestOrder,
} from "@lib/data/admin-new";
import { useAdminAuth } from "@lib/context/admin-auth-context";
import { toast } from "sonner";
import LoadingSpinner from "components/LoadingSpinner";

export default function PaymentsPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    completedCount: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = useCallback(async () => {
    if (admin) {
      try {
        const [paymentsData, statsData] = await Promise.all([
          listPayments(),
          getPaymentStats(),
        ]);
        setPayments(paymentsData as any[]);
        setStats(statsData as any);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to fetch payments");
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

  const handleStatusUpdate = async (paymentId: number, newStatus: string) => {
    try {
      await updatePaymentStatus(paymentId, newStatus);
      toast.success(`Payment status updated to ${newStatus}`);
      // Refresh the data
      const [paymentsData, statsData] = await Promise.all([
        listPayments(),
        getPaymentStats(),
      ]);
      setPayments(paymentsData as any[]);
      setStats(statsData as any);
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  // const handleCreateTestOrder = async () => {
  //   try {
  //     await createTestOrder();
  //     toast.success("Test order created successfully");
  //     // Refresh the data
  //     const [paymentsData, statsData] = await Promise.all([
  //       listPayments(),
  //       getPaymentStats(),
  //     ]);
  //     setPayments(paymentsData);
  //     setStats(statsData);
  //   } catch (error) {
  //     console.error("Error creating test order:", error);
  //     toast.error("Failed to create test order");
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredPayments =
    statusFilter === "ALL"
      ? payments
      : payments.filter((payment: any) => payment.status === statusFilter);

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!admin) {
    return null; // Will be handled by ProtectedAdminRoute
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage payment transactions and refunds</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{stats.totalRevenue}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Payment Transactions ({filteredPayments.length})
            </CardTitle>
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="outline"
                onClick={handleCreateTestOrder}
                className="text-sm"
              >
                Create Test Order
              </Button> */}
              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.transactionId || `#${payment.id}`}
                    </TableCell>
                    <TableCell>
                      {payment.orderNumber || `#${payment.orderId}`}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payment.customerName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.customerEmail || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>₹{payment.amount || 0}</TableCell>
                    <TableCell>
                      {payment.paymentMethodDisplay ||
                        payment.paymentMethod ||
                        "COD"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.statusDisplay || payment.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {payment.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(payment.id, "COMPLETED")
                            }
                          >
                            Mark Paid
                          </Button>
                        )}
                        {payment.status === "COMPLETED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(payment.id, "REFUNDED")
                            }
                          >
                            Refund
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-8"
                  >
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
