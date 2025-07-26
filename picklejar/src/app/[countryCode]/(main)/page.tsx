import { Metadata } from "next";

import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { listCollections, Collection } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { listProductsByCollection, Product } from "@lib/data/products";

export const metadata: Metadata = {
  title: "PickleJar - Fresh Pickles",
  description:
    "A premium pickle e-commerce store with the freshest and tastiest pickles.",
};

type CollectionWithProducts = Collection & {
  products: Product[];
};

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;

  let region = null;
  let collections: Collection[] = [];
  let collectionsWithProducts: CollectionWithProducts[] = [];

  try {
    region = await getRegion("in");
    collections = await listCollections();

    // Fetch products for each collection
    collectionsWithProducts = await Promise.all(
      collections.map(async (collection) => {
        try {
          const products = await listProductsByCollection(
            Number(collection.id)
          );
          return {
            ...collection,
            products,
          };
        } catch (error) {
          console.error(
            `Error fetching products for collection ${collection.id}:`,
            error
          );
          return {
            ...collection,
            products: [],
          };
        }
      })
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  // Check if we have real data (not mock data)
  const hasRealData =
    collectionsWithProducts &&
    collectionsWithProducts.length > 0 &&
    region &&
    !collectionsWithProducts.some((collection: CollectionWithProducts) =>
      collection.id.toString().startsWith("mock-")
    );

  return (
    <>
      <Hero />
      <div className="py-12">
        {hasRealData && region ? (
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts
              collections={collectionsWithProducts}
              region={region}
            />
          </ul>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              No Products Available
            </h2>
            <p className="text-gray-600">
              There are currently no products to display. Please check back
              later.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
