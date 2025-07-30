"use client";

import { useEffect, useState } from "react";
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
import { listPayments } from "@lib/data/admin";
import { useAdminAuth } from "@lib/context/admin-auth-context";

export default function PaymentsPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (admin) {
        try {
          const paymentsData = await listPayments();
          setPayments(paymentsData);
        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading) {
        setIsLoading(false);
      }
    };

    fetchPayments();
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
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage payment transactions and refunds</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Transactions ({payments.length})</CardTitle>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>All Payments</option>
              <option>Successful</option>
              <option>Failed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">#{payment.id}</TableCell>
                    <TableCell>#{payment.orderId}</TableCell>
                    <TableCell>₹{payment.amount || 0}</TableCell>
                    <TableCell>{payment.method || "Credit Card"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "successful"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="destructive" size="sm">
                          Refund
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
