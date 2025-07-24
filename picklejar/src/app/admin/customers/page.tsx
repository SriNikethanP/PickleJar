import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listCustomers, getOrderCount } from "@/lib/data/admin";

export default async function AdminCustomersPage() {
  const customers = await listCustomers();
  // Optionally, fetch order counts in parallel (for demo, just show 0)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id}>
                  <td>{c.fullName}</td>
                  <td>{c.email}</td>
                  <td>{c.mobile}</td>
                  <td>{/* Optionally fetch order count */}0</td>
                  <td>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="secondary" className="ml-2">
                      Edit
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
