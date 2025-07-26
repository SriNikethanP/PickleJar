"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog";
import { Button } from "@lib/components/ui/button";
import { updateProduct, deleteProductImage } from "@lib/data/admin";
import { toast } from "sonner";
import { Input } from "@lib/components/ui/input";
import { Upload, X, Trash2 } from "lucide-react";

export default function EditProductDialog({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    categoryName: product.categoryName || "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product.imageUrls || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length < 1 || files.length > 3) {
      toast.error("Please select 1 to 3 images.");
      return;
    }
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeNewImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
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
    if (images.length > 0 && (images.length < 1 || images.length > 3)) {
      toast.error("Please select 1 to 3 images.");
      return;
    }
    setLoading(true);
    try {
      await updateProduct(
        product.id,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        images
      );
      toast.success("Product updated successfully");
      setOpen(false);
      setImages([]);
      setImagePreviews([]);
      onSuccess();
    } catch {
      toast.error("Failed to update product");
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
      <DialogContent className="bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md">
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
            name="categoryName"
            placeholder="Category"
            value={form.categoryName}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full"
          />
          <Input
            name="stock"
            placeholder="Stock Quantity"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full"
          />

          {/* Custom File Upload */}
          <div className="space-y-2">
            <label
              htmlFor="product-images-edit"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 3 files (optional)
                </p>
              </div>
              <input
                id="product-images-edit"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Existing Images:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((imageUrl, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imageUrl)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Images:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
