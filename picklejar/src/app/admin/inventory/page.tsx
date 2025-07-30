"use client";
import { useState, useCallback, useEffect } from "react";
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
import AddProductDialog from "@modules/admin/components/inventory/AddProductDialog";
import EditProductDialog from "@modules/admin/components/inventory/EditProductDialog";
import { listInventory } from "@lib/data/admin";
import { useAdminAuth } from "@lib/context/admin-auth-context";

export default function InventoryPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (admin) {
      try {
        const data = await listInventory();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [admin, authLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600">
          Manage product inventory and stock levels
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Inventory ({products.length})</CardTitle>
            <AddProductDialog onSuccess={fetchProducts} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {product.name?.charAt(0) || "P"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name || "Unnamed Product"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku || `SKU-${product.id}`}</TableCell>
                    <TableCell>{product.stock || 0} units</TableCell>
                    <TableCell>₹{product.price || 0}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (product.stock || 0) > 10
                            ? "bg-green-100 text-green-800"
                            : (product.stock || 0) > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(product.stock || 0) > 10
                          ? "In Stock"
                          : (product.stock || 0) > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <EditProductDialog
                          product={product}
                          onSuccess={fetchProducts}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-8"
                  >
                    No products found
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
