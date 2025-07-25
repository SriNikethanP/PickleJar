import { Product } from "@lib/data/products";
import { getPercentageDiff } from "./get-precentage-diff";
import { convertToLocale } from "./money";

// This is a placeholder. Update this logic if you add variants to Product.
export const getPricesForProduct = (product: Product) => {
  return {
    calculated_price_number: product.price,
    calculated_price: convertToLocale({
      amount: product.price,
      currency_code: "USD", // Adjust if you add currency to Product
    }),
    original_price_number: product.price,
    original_price: convertToLocale({
      amount: product.price,
      currency_code: "USD",
    }),
    currency_code: "USD",
    price_type: "default",
    percentage_diff: 0,
  };
};

export function getProductPrice({ product }: { product: Product }) {
  if (!product || !product.id) {
    throw new Error("No product provided");
  }

  return {
    product,
    cheapestPrice: getPricesForProduct(product),
    variantPrice: getPricesForProduct(product),
  };
}
