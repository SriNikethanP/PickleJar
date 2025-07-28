import { Product } from "@lib/data/products";
import ProductPrice from "@modules/products/components/product-price";
import { ProductRating } from "../../../../components/product/ProductRating";

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
        <ProductRating
          rating={product.averageRating}
          totalReviews={product.reviews?.length || 0}
          size="lg"
          showCount={true}
        />
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
