import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@lib/components/ui/card";
import { Button } from "@lib/components/ui/button";
import { listInventory } from "@lib/data/admin";

export default async function AdminInventoryPage() {
  const products = await listInventory();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.stock === 0 ? (
                      <span className="text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    ) : p.stock < 10 ? (
                      <span className="text-yellow-600 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td>
                    <Button size="sm" variant="outline">
                      Restock
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
