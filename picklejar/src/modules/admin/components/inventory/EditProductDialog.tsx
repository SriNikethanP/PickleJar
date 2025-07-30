"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog";
import { Button } from "@lib/components/ui/button";
import {
  updateProduct,
  deleteProductImage,
  listCategories,
  listCollections,
} from "@lib/data/admin-new";
import { toast } from "sonner";
import { Input } from "@lib/components/ui/input";
import { Trash2 } from "lucide-react";
import ImageUpload from "../../../../components/ImageUpload";

export default function EditProductDialog({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    categoryName: product.categoryName || "",
    categoryId: product.categoryId || "",
    collectionId: product.collectionId || "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product.imageUrls || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, collectionsData] = await Promise.all([
          listCategories(),
          listCollections(),
        ]);
        setCategories(categoriesData as any[]);
        setCollections(collectionsData as any[]);
        console.log("Fetched categories:", categoriesData);
        console.log("Fetched collections:", collectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Update form when product changes
  useEffect(() => {
    console.log("Product data received:", product);
    console.log("Product category:", product.category);
    console.log("Product collection:", product.collection);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      categoryName: product.categoryName || "",
      categoryId: product.categoryId || "",
      collectionId: product.collectionId || "",
    });
    setExistingImages(product.imageUrls || []);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeExistingImage = async (imageUrl: string) => {
    try {
      await deleteProductImage(product.id, imageUrl);
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await updateProduct(
        product.id,
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
      toast.success("Product updated successfully");
      setOpen(false);
      setImages([]);
      onSuccess();
    } catch (error: any) {
      // Show specific error message from backend
      const errorMessage = error.message || "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Existing Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Images
            </label>
            <ImageUpload
              images={images}
              setImages={setImages}
              maxImages={3 - existingImages.length}
              maxSize={10}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
