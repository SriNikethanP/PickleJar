import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { listPayments } from "@/lib/data/admin";

export default async function AdminPaymentsPage() {
  const payments = await listPayments();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Paid At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <Link href={`/admin/orders/${p.orderId}`}>{p.orderId}</Link>
                  </td>
                  <td>${p.amount}</td>
                  <td>{p.status}</td>
                  <td>{p.method}</td>
                  <td>{p.paidAt?.slice(0, 10)}</td>
                  <td>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
