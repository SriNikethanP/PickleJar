import { Metadata } from "next";

import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";

export const metadata: Metadata = {
  title: "PickleJar - Fresh Pickles",
  description:
    "A premium pickle e-commerce store with the freshest and tastiest pickles.",
};

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;

  const region = await getRegion("in");
  const { collections } = await listCollections({
    fields: "id, handle, title",
  });

  // Check if we have real data (not mock data)
  const hasRealData =
    collections &&
    collections.length > 0 &&
    region &&
    !collections.some((collection) => collection.id.startsWith("mock-"));

  return (
    <>
      <Hero />
      <div className="py-12">
        {hasRealData ? (
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
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
