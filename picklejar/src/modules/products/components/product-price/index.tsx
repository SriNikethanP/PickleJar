import { clx } from "@medusajs/ui";
import { Product } from "@lib/data/products";

type ProductPriceProps = {
  product: Product;
};

const ProductPrice = ({ product }: ProductPriceProps) => {
  const price = product.price;

  return (
    <div className="flex items-baseline space-x-2">
      <span className="text-3xl font-bold text-gray-900">
        ₹{price.toFixed(2)}
      </span>
      <span className="text-sm text-gray-500">per unit</span>
    </div>
  );
};

export default ProductPrice;
