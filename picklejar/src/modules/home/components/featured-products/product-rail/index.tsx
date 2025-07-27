import { Text } from "@medusajs/ui";
import { Collection } from "@lib/data/collections";
import { Product } from "@lib/data/products";

import InteractiveLink from "@modules/common/components/interactive-link";
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
      <div className="w-full">
        {/* Collection Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h3 className="text-xl lg:text-2xl font-semibold text-black mb-4">
            {collection.title}
          </h3>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
          {collectionProducts.map((product: Product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <ProductPreview product={product} region={region} isFeatured />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <button className="inline-flex items-cente text-black text-xs font-normal  hover:text-md duration-300 transform hover:-translate-y-1">
            View All {collection.title} →
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ProductRail:", error);
    return null;
  }
}
