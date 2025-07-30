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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog";
import { Button } from "@lib/components/ui/button";
import AddProductDialog from "@modules/admin/components/inventory/AddProductDialog";
import EditProductDialog from "@modules/admin/components/inventory/EditProductDialog";
import { listInventory, deleteProduct } from "@lib/data/admin-new";
import { useAdminAuth } from "@lib/context/admin-auth-context";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function InventoryPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (admin) {
      try {
        const data = await listInventory();
        setProducts(data as any[]);
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

  const handleDeleteProduct = async (
    productId: number,
    productName: string
  ) => {
    try {
      await deleteProduct(productId);
      toast.success(`Product "${productName}" deactivated successfully`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to deactivate product");
      console.error("Error deactivating product:", error);
    }
  };

  // Delete Confirmation Dialog Component
  const DeleteProductDialog = ({ product }: { product: any }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      setLoading(true);
      try {
        await handleDeleteProduct(product.id, product.name);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to deactivate{" "}
              <strong>"{product.name}"</strong>? The product will be hidden from
              customers but can be reactivated later.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deactivating..." : "Deactivate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
                        <DeleteProductDialog product={product} />
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
