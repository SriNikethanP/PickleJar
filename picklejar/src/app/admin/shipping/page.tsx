import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listShipments } from "@/lib/data/admin";

export default async function AdminShippingPage() {
  const shipments = await listShipments();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Carrier</th>
                <th>Tracking #</th>
                <th>Status</th>
                <th>Shipped At</th>
                <th>Delivered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.orderId}</td>
                  <td>{s.carrier}</td>
                  <td>{s.trackingNumber}</td>
                  <td>{s.status}</td>
                  <td>{s.shippedAt}</td>
                  <td>{s.deliveredAt || "-"}</td>
                  <td>
                    <Button size="sm" variant="outline">
                      Update Status
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
