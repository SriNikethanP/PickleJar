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
    <LocalizedClientLink
      href={`/in/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group"
    >
      <div
        data-testid="product-wrapper"
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <div className="relative">
          <Thumbnail
            thumbnail={product.imageUrls?.[0] || null}
            images={product.imageUrls?.map((url) => ({ url })) || []}
            size="full"
            isFeatured={isFeatured}
          />
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Out of Stock
            </div>
          )}
          {product.averageRating > 0 && (
            <div className="absolute bottom-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              ⭐ {product.averageRating.toFixed(1)}
            </div>
          )}
        </div>
        <div className="p-4">
          <Text
            className="text-ui-fg-subtle font-medium mb-2 line-clamp-2"
            data-testid="product-title"
          >
            {product.name}
          </Text>
          {product.categoryName && (
            <Text className="text-ui-fg-muted text-sm mb-2">
              {product.categoryName}
            </Text>
          )}
          <div className="flex items-center justify-between">
            <span className="text-ui-fg-base font-bold text-lg">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-ui-fg-muted text-sm">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
