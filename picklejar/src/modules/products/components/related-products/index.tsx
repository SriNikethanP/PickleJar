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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Related Products
        </h2>
        <p className="text-gray-600">You might also like these products</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <div key={relatedProduct.id} className="flex justify-center">
            <ProductPreview product={relatedProduct} region={null} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
