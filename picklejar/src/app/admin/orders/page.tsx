import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@lib/components/ui/card";
import { Button } from "@lib/components/ui/button";
import { listOrders } from "@lib/data/admin";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user?.fullName}</td>
                  <td>${o.totalAmount}</td>
                  <td>{o.status}</td>
                  <td>{o.placedAt?.slice(0, 10)}</td>
                  <td>
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                    <Button size="sm" variant="destructive" className="ml-2">
                      Refund
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
