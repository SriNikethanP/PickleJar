"use client";

import { useState, useEffect } from "react";
import { Button } from "@lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { toast } from "sonner";
import { listCollections, deleteCollection } from "@lib/data/admin";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCollectionDialog from "@modules/admin/components/collections/AddCollectionDialog";
import EditCollectionDialog from "@modules/admin/components/collections/EditCollectionDialog";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    collectionId: number | null;
    collectionTitle: string;
  }>({
    isOpen: false,
    collectionId: null,
    collectionTitle: "",
  });

  const fetchCollections = async () => {
    try {
      const data = await listCollections();
      setCollections(data as any[]);
    } catch (error) {
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDeleteClick = (id: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      collectionId: id,
      collectionTitle: title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.collectionId) {
      try {
        await deleteCollection(deleteDialog.collectionId);
        toast.success("Collection deleted successfully");
        fetchCollections();
      } catch (error) {
        toast.error("Failed to delete collection");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      collectionId: null,
      collectionTitle: "",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <AddCollectionDialog onSuccess={fetchCollections} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
        </CardHeader>
        <CardContent>
          {collections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No collections found. Create your first collection!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Products</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{collection.id}</td>
                      <td className="p-2 font-medium">{collection.title}</td>
                      <td className="p-2">{collection.productCount || 0}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <EditCollectionDialog
                            collection={collection}
                            onSuccess={fetchCollections}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteClick(collection.id, collection.title)
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
        title="Delete Collection"
        description={`Are you sure you want to delete "${deleteDialog.collectionTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
