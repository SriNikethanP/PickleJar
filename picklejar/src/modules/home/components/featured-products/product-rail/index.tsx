import { listProductsByCollection } from "@lib/data/products";
import { Text } from "@medusajs/ui";
import { Collection } from "@lib/data/collections";

import InteractiveLink from "@modules/common/components/interactive-link";
import ProductPreview from "@modules/products/components/product-preview";

export default async function ProductRail({
  collection,
  region,
}: {
  collection: Collection;
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
    const products = await listProductsByCollection(Number(collection.id));
    const collectionProducts = products?.slice(0, 6);

    if (!collectionProducts?.length) {
      return null;
    }

    return (
      <div className="content-container py-12 small:py-24">
        <div className="flex justify-between mb-8">
          <Text className="txt-xlarge">{collection.title}</Text>
          {/* No handle, so just link to /collections or remove this link */}
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
          {collectionProducts.map((product: any) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error in ProductRail:", error);
    return null;
  }
}
