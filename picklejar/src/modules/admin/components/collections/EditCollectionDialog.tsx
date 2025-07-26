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
import { Input } from "@lib/components/ui/input";
import { updateCollection } from "@lib/data/admin";
import { toast } from "sonner";
import { Edit } from "lucide-react";

export default function EditCollectionDialog({
  collection,
  onSuccess,
}: {
  collection: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: collection.title || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCollection(collection.id, { title: form.title });
      toast.success("Collection updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to update collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Collection Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Collection"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
