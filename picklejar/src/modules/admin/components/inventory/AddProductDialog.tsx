"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog";
import { Input } from "@lib/components/ui/input";
import { Button } from "@lib/components/ui/button";
import {
  addProduct,
  listCategories,
  listCollections,
} from "@lib/data/admin-new";
import { toast } from "sonner";
import ImageUpload from "../../../../components/ImageUpload";

export default function AddProductDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "",
    categoryId: "",
    collectionId: "",
  });
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, collectionsData] = await Promise.all([
          listCategories(),
          listCollections(),
        ]);
        setCategories(categoriesData as any[]);
        setCollections(collectionsData as any[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image handling is now managed by the ImageUpload component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    setLoading(true);
    try {
      await addProduct(
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          categoryId: form.categoryId ? Number(form.categoryId) : undefined,
          collectionId: form.collectionId
            ? Number(form.collectionId)
            : undefined,
        },
        images
      );
      toast.success("Product added successfully");
      setOpen(false);
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryName: "",
        categoryId: "",
        collectionId: "",
      });
      setImages([]);
      onSuccess();
    } catch (error: any) {
      // Show specific error message from backend
      const errorMessage = error.message || "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full"
          />

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Collection
            </label>
            <select
              name="collectionId"
              value={form.collectionId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Collection (Optional)</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Images
            </label>
            <ImageUpload
              images={images}
              setImages={setImages}
              maxImages={3}
              maxSize={10}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
