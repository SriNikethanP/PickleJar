import { Product } from "@lib/data/products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

interface MinPricedProduct extends Product {
  _minPrice?: number;
}

/**
 * Helper function to sort products by price until the store API supports sorting by price
 * @param products
 * @param sortBy
 * @returns products sorted by price
 */
export function sortProducts(
  products: Product[],
  sortBy: SortOptions
): Product[] {
  let sortedProducts = products as MinPricedProduct[];

  if (["price_asc", "price_desc"].includes(sortBy)) {
    // Precompute the minimum price for each product
    sortedProducts.forEach((product) => {
      product._minPrice = product.price;
    });

    // Sort products based on the precomputed minimum prices
    sortedProducts.sort((a, b) => {
      const diff = a._minPrice! - b._minPrice!;
      return sortBy === "price_asc" ? diff : -diff;
    });
  }

  // Product type does not have createdAt/created_at, so we skip created_at sorting
  // If you add a date field to Product, you can implement date sorting here

  return sortedProducts;
}
