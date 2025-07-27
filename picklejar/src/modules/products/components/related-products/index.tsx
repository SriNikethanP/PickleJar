import { Product } from "@lib/data/products";
import { getAllProducts } from "@lib/data/products";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ProductPreview from "@modules/products/components/product-preview";

type RelatedProductsProps = {
  product: Product;
  countryCode: string;
};

const RelatedProducts = async ({
  product,
  countryCode,
}: RelatedProductsProps) => {
  const products = await getAllProducts();

  // Get related products from the same category
  const relatedProducts = products
    .filter(
      (p) => p.categoryName === product.categoryName && p.id !== product.id
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <h2 className="text-2xl font-bold">Related Products</h2>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8">
        {relatedProducts.map((product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/${countryCode}/products/${product.name.toLowerCase()}`}
          >
            <ProductPreview product={product} region={null} />
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
