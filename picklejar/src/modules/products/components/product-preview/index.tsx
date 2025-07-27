import { Text } from "@medusajs/ui";
import { Product } from "@lib/data/products";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "../thumbnail";

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: Product;
  isFeatured?: boolean;
  region?: any;
}) {
  return (
    <LocalizedClientLink href={`/products/${product.id}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.imageUrls?.[0] || null}
          images={product.imageUrls?.map((url) => ({ url })) || []}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.name}
          </Text>
          <div className="flex items-center gap-x-2">
            <span className="text-ui-fg-base font-semibold">
              INR{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
