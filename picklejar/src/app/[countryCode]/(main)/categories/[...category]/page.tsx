import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCategoryByHandle, listCategories } from "@lib/data/categories";
import { getAllProducts } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { sortProducts } from "@lib/util/sort-products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import RefinementList from "@modules/store/components/refinement-list";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import ProductPreview from "@modules/products/components/product-preview";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>;
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
  }>;
};

export async function generateStaticParams() {
  const product_categories = await listCategories();

  if (!product_categories) {
    return [];
  }

  const countryCodes = ["IN"]; // Assuming India as the default country

  const categoryHandles = product_categories
    .map((category: any) => {
      if (!category.handle) {
        console.warn("Category without handle found:", category);
        return null;
      }
      return category.handle;
    })
    .filter((handle): handle is string => handle !== null);

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: string) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat();

  console.log("Generated static params for categories:", staticParams);
  return staticParams || [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const productCategory = await getCategoryByHandle(
      params.category.join("/")
    );
    if (!productCategory) notFound();

    const title = productCategory.name + " | Pickle Jar";
    const description = productCategory.description ?? `${title} category.`;

    return {
      title: `${title} | Pickle Jar`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sortBy, page } = searchParams;

  const productCategory = await getCategoryByHandle(params.category);
  const region = await getRegion(params.countryCode);

  if (!productCategory) {
    notFound();
  }

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

  // Fetch all products and filter by category
  const allProducts = await getAllProducts();
  const categoryProducts = allProducts.filter(
    (product) =>
      product.categoryName?.toLowerCase() ===
      productCategory.name?.toLowerCase()
  );

  // Apply sorting
  let sortedProducts = categoryProducts;
  if (sortBy) {
    sortedProducts = sortProducts(categoryProducts, sortBy);
  }

  const sort = sortBy || "latest";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            data-testid="category-page-title"
          >
            {productCategory.name}
          </h1>
          {productCategory.description && (
            <p className="text-lg text-gray-600">
              {productCategory.description}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <RefinementList sortBy={sort} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              {sortedProducts.length === 0 ? (
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
                    <p className="text-gray-600">
                      No products found in this category.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                      <div key={product.id} className="group">
                        <LocalizedClientLink
                          href={`/${params.countryCode}/products/${product.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          <ProductPreview product={product} region={region} />
                        </LocalizedClientLink>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
