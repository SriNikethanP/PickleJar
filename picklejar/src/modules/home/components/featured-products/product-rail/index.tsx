import { Text } from "@medusajs/ui";
import { Collection } from "@lib/data/collections";
import { Product } from "@lib/data/products";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ProductPreview from "@modules/products/components/product-preview";
import { ArrowRightIcon } from "lucide-react";

type CollectionWithProducts = Collection & {
  products: Product[];
};

export default async function ProductRail({
  collection,
  region,
}: {
  collection: CollectionWithProducts;
  region: {
    id: string;
    name: string;
    currency_code: string;
    countries: {
      id: string;
      iso_2: string;
      iso_3: string;
      num_code: string;
      name: string;
    }[];
  };
}) {
  try {
    const collectionProducts = collection.products?.slice(0, 6);

    if (!collectionProducts?.length) {
      return null;
    }

    return (
      <section className="w-full py-12 lg:py-16">
        {/* Collection Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {collection.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {collectionProducts.map((product: Product) => (
            <div key={product.id} className="group">
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <LocalizedClientLink
            href={`/collections/${collection.title
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
          >
            View All {collection.title}
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </LocalizedClientLink>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in ProductRail:", error);
    return null;
  }
}
