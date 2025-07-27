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
        className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105"
      >
        <div className="relative">
          <Thumbnail
            thumbnail={product.imageUrls?.[0] || null}
            images={product.imageUrls?.map((url) => ({ url })) || []}
            size="full"
            isFeatured={isFeatured}
          />

          {/* Stock Status Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg">
              Out of Stock
            </div>
          )}

          {/* Rating Badge */}
          {product.averageRating > 0 && (
            <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              ⭐ {product.averageRating.toFixed(1)}
            </div>
          )}

          {/* Category Badge */}
          {product.categoryName && (
            <div className="absolute top-4 left-4 text-white rounded-full bg-black px-3 py-2 text-sm font-thin shadow-lg">
              {product.categoryName}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2">
          <div className="flex flex-col items-center justify-between mb-4">
            <Text
              className="text-black font-medium text-2xl mb-3 line-clamp-2 "
              data-testid="product-title"
            >
              {product.name}
            </Text>
            <span className="text-md font-semibold text-black">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-red-400 text-xs font-normal">
              {product.stock == 0 && "Out of stock"}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full text-black py-3 px-8 font-semibold transition-all duration-300 hover:bg-black hover:text-white transform hover:-translate-y-1  ">
            Add to Cart
          </button>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
