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
      href={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group block h-full"
    >
      <div
        data-testid="product-wrapper"
        className="h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group-hover:scale-[1.02]"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Thumbnail
            thumbnail={product.imageUrls?.[0] || null}
            images={product.imageUrls?.map((url) => ({ url })) || []}
            size="full"
            isFeatured={isFeatured}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute inset-0 pointer-events-none p-3">
            {/* Category Badge */}
            {product.categoryName && (
              <div className="absolute top-3 left-3">
                <span className="inline-block bg-black/90 text-white rounded-md px-2 py-1 text-xs font-medium backdrop-blur-sm">
                  {product.categoryName}
                </span>
              </div>
            )}

            {/* Out of Stock Badge */}
            {product.stock <= 0 && (
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-red-500/95 text-white rounded-md px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Rating Badge */}
            {product.averageRating > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1 bg-yellow-400/95 text-black rounded-md px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                  <span>⭐</span>
                  <span>{product.averageRating.toFixed(1)}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Product Title */}
            <Text
              className="text-gray-900 font-semibold line-clamp-2 leading-tight transition-colors group-hover:text-black text-sm sm:text-base"
              data-testid="product-title"
            >
              {product.name}
            </Text>

            {/* Price and Stock Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-bold text-lg">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.stock === 0 && (
                  <span className="text-red-500 text-xs font-medium">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-orange-600 text-xs font-medium">
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full py-2.5 px-4 font-medium rounded-lg text-sm bg-gray-100 text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-400"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
