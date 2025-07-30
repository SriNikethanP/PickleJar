"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { toast } from "sonner";
import { listCategories, deleteCategory } from "@lib/data/admin";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCategoryDialog from "@modules/admin/components/categories/AddCategoryDialog";
import EditCategoryDialog from "@modules/admin/components/categories/EditCategoryDialog";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import LoadingSpinner from "components/LoadingSpinner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const data = await listCategories();
      setCategories(data as any[]);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteDialog({
      isOpen: true,
      categoryId: id,
      categoryName: name,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.categoryId) {
      try {
        await deleteCategory(deleteDialog.categoryId);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      categoryId: null,
      categoryName: "",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <AddCategoryDialog onSuccess={fetchCategories} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Products</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{category.id}</td>
                      <td className="p-2 font-medium">{category.name}</td>
                      <td className="p-2">{category.productCount || 0}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <EditCategoryDialog
                            category={category}
                            onSuccess={fetchCategories}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteClick(category.id, category.name)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDialog.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
