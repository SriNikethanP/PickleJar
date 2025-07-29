import { Product } from "@lib/data/products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

interface MinPricedProduct extends Product {
  _minPrice?: number;
}

/**
 * Helper function to sort products by price and creation order
 * @param products
 * @param sortBy
 * @returns products sorted according to the specified criteria
 */
export function sortProducts(
  products: Product[],
  sortBy: SortOptions
): Product[] {
  let sortedProducts = [...products] as MinPricedProduct[];

  switch (sortBy) {
    case "latest":
      // Sort by ID in descending order (assuming higher IDs are newer)
      sortedProducts.sort((a, b) => b.id - a.id);
      break;

    case "price_asc":
      // Sort by price in ascending order
      sortedProducts.forEach((product) => {
        product._minPrice = product.price;
      });
      sortedProducts.sort((a, b) => {
        const diff = a._minPrice! - b._minPrice!;
        return diff;
      });
      break;

    case "price_desc":
      // Sort by price in descending order
      sortedProducts.forEach((product) => {
        product._minPrice = product.price;
      });
      sortedProducts.sort((a, b) => {
        const diff = a._minPrice! - b._minPrice!;
        return -diff;
      });
      break;

    default:
      // Default to latest
      sortedProducts.sort((a, b) => b.id - a.id);
      break;
  }

  return sortedProducts;
}
