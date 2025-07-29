import { Product } from "@lib/data/products";
import { getAllProducts, listProductsByCollection } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { sortProducts } from "@lib/util/sort-products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import { Suspense } from "react";

import ProductPreview from "@modules/products/components/product-preview";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";

const PRODUCT_LIMIT = 12;
type Products = Product[];
export default async function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  collectionId,
}: {
  sortBy?: SortOptions;
  page: number;
  countryCode: string;
  collectionId?: string;
}) {
  let region = null;
  let products: Product[] = [];
  let count = 0;

  try {
    region = await getRegion(countryCode);

    if (!region) {
      return (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Region Not Found
            </h2>
            <p className="text-gray-600">
              The requested region is not available.
            </p>
          </div>
        </div>
      );
    }

    // Get products based on whether we're filtering by collection or not
    if (collectionId) {
      // Get products for specific collection
      const result = await listProductsByCollection(parseInt(collectionId));
      products = result || [];
      count = result.length || 0;
    } else {
      // Get all products
      const result = await getAllProducts();
      products = result || [];
      count = result.length || 0;
    }

    // Apply sorting using the utility function
    if (sortBy) {
      console.log("Applying sorting with:", sortBy);
      products = sortProducts(products, sortBy);
    } else {
      console.log("No sorting applied, using default order");
    }

    // Apply pagination
    const startIndex = (page - 1) * PRODUCT_LIMIT;
    const endIndex = startIndex + PRODUCT_LIMIT;
    products = products.slice(startIndex, endIndex);
  } catch (error) {
    console.error("Error in PaginatedProducts:", error);
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Error Loading Products
          </h2>
          <p className="text-gray-600">
            There was an error loading the products. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            No Products Found
          </h2>
          <p className="text-gray-600">No products are currently available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <div key={product.id} className="group">
            <ProductPreview product={product} region={region} />
          </div>
        ))}
      </div>
    </div>
  );
}
