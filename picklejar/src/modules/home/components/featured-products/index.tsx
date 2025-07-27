import ProductRail from "@modules/home/components/featured-products/product-rail";
import { Collection } from "@lib/data/collections";
import { Product } from "@lib/data/products";

type CollectionWithProducts = Collection & {
  products: Product[];
};

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: CollectionWithProducts[];
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
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ));
}
