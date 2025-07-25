import { Product } from "@lib/data/products";

export const isSimpleProduct = (product: Product): boolean => {
  // If you add options/variants to Product, update this logic accordingly
  // For now, always return true (or adjust as needed for your Product type)
  return true;
};
