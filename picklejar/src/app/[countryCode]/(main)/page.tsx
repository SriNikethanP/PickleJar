import { Metadata } from "next";
import { Suspense } from "react";

import Hero from "@modules/home/components/hero";
import { Product } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { listProductsByCollection } from "@lib/data/products";
import { listCollections } from "@lib/data/collections";
import FeaturedProducts from "@modules/home/components/featured-products";
import LoadingSpinner from "components/LoadingSpinner";

export const metadata: Metadata = {
  title: "PickleJar - Fresh Pickles",
  description:
    "A premium pickle e-commerce store with the freshest and tastiest pickles.",
};

type Products = Product[];

// Loading component for Suspense
function FeaturedProductsSkeleton() {
  return (
    <div className="space-y-20 lg:space-y-32">
      <div className="text-center py-20 lg:py-32">
        <LoadingSpinner size="lg" className="py-8" />
        <p className="text-lg text-gray-500 mt-4">Loading fresh pickles...</p>
      </div>
    </div>
  );
}

// Async component for featured products
async function FeaturedProductsSection() {
  const [collections, region] = await Promise.all([
    listCollections(),
    getRegion("in"),
  ]);

  if (!collections || collections.length === 0 || !region) {
    return (
      <div className="text-center py-20 lg:py-32">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-black mb-4">
            No Products Available
          </h3>
          <p className="text-lg text-gray-500 leading-relaxed">
            There are currently no products to display. Please check back later
            for our fresh pickles.
          </p>
        </div>
      </div>
    );
  }

  // Fetch products for each collection in parallel
  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => ({
      ...collection,
      products: await listProductsByCollection(Number(collection.id)),
    }))
  );

  const hasRealData =
    collectionsWithProducts &&
    collectionsWithProducts.length > 0 &&
    region &&
    !collectionsWithProducts.some((collection: any) =>
      collection.id.toString().startsWith("mock-")
    );

  if (!hasRealData) {
    return (
      <div className="text-center py-20 lg:py-32">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-black mb-4">
            No Products Available
          </h3>
          <p className="text-lg text-gray-500 leading-relaxed">
            There are currently no products to display. Please check back later
            for our fresh pickles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 lg:space-y-32">
      <FeaturedProducts collections={collectionsWithProducts} region={region} />
    </div>
  );
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Featured Products Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          {/* <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
              Our Fresh Pickles
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handcrafted pickles made with the finest ingredients
              and traditional recipes passed down through generations
            </p>
          </div> */}

          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProductsSection />
          </Suspense>
        </div>
      </section>

      {/* Additional Sections for Better Layout */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-black mb-8">
              Why Choose PickleJar?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">
                  Fresh Ingredients
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  We use only the freshest, locally-sourced ingredients for our
                  pickles.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">
                  Traditional Recipes
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Our recipes have been passed down through generations of
                  pickle makers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">
                  Made with Love
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Every jar is carefully crafted with attention to detail and
                  passion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
