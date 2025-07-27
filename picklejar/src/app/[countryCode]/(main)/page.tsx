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
      <div className="py-12">
        {products?.length > 0 && region ? (
          <ul className="flex flex-col gap-x-6">
            {products.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} />
              </li>
            ))}
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
