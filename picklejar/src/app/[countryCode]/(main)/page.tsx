import { Metadata } from "next";

import Hero from "@modules/home/components/hero";
import { Product } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { getAllProducts } from "@lib/data/products";
import ProductPreview from "@modules/products/components/product-preview";

export const metadata: Metadata = {
  title: "PickleJar - Fresh Pickles",
  description:
    "A premium pickle e-commerce store with the freshest and tastiest pickles.",
};

type Products = Product[];

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;

  let region = null;
  let products: Products = [];

  try {
    region = await getRegion(params.countryCode);
    products = await getAllProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      <Hero />
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Fresh Pickles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handcrafted pickles made with the finest ingredients
              and traditional recipes
            </p>
          </div>

          {products?.length > 0 && region ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <ProductPreview product={product} region={region} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-500">
                  There are currently no products to display. Please check back
                  later.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
