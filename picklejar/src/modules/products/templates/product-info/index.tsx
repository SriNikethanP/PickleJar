import { Product } from "@lib/data/products";
import ProductPrice from "@modules/products/components/product-price";

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Product Title and Category */}
      <div className="space-y-2">
        {product.categoryName && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {product.categoryName}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="border-t border-gray-200 pt-4">
        <ProductPrice product={product} />
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              product.stock > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        {product.stock > 0 && (
          <span className="text-sm text-gray-500">
            {product.stock} units available
          </span>
        )}
      </div>

      {/* Rating */}
      {product.averageRating > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.averageRating.toFixed(1)} ({product.reviews?.length || 0}{" "}
            reviews)
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
