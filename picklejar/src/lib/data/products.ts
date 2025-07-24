import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Product = {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  stock: number;
  reviews: any[];
  category: { id: number; name: string } | null;
  active: boolean;
};

export const listProducts = async ({
  page = 1,
  limit = 12,
  sortBy = "createdAt",
  order = "desc",
  name,
  category,
  inStock,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  name?: string;
  category?: string;
  inStock?: boolean;
} = {}): Promise<{ products: Product[]; count: number }> => {
  const params: Record<string, any> = {
    page,
    limit,
    sortBy,
    order,
  };
  if (name) params.name = name;
  if (category) params.category = category;
  if (typeof inStock === "boolean") params.inStock = inStock;

  const res = await api.get("/products/search", { params });
  // Expecting backend to return { products: [...], count: number }
  return res.data;
};
