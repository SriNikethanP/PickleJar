import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export type Category = {
  id: number;
  name: string;
  products: any[];
};

export const listCategories = async (): Promise<Category[]> => {
  // If you have a /categories endpoint, use it. Otherwise, extract from products.
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryByHandle = async (
  categoryHandle: string[]
): Promise<Category | null> => {
  const categoryName = categoryHandle.join("/");
  const res = await api.get("/categories", { params: { name: categoryName } });
  // If backend returns a list, return the first match
  return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
};
