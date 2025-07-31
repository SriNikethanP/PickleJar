import ProductRail from "@modules/home/components/featured-products/product-rail";

type CollectionWithProducts = any & {
  products: any[];
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
  return (
    <div className="space-y-20 lg:space-y-32">
      {collections.map((collection) => (
        <ProductRail
          key={collection.id}
          collection={collection}
          region={region}
        />
      ))}
    </div>
  );
}
