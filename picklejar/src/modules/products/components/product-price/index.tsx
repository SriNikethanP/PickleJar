import { clx } from "@medusajs/ui";
import { Product } from "@lib/data/products";

type ProductPriceProps = {
  product: Product;
};

const ProductPrice = ({ product }: ProductPriceProps) => {
  const price = product.price;

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span className="text-xl font-semibold">₹{price}</span>
    </div>
  );
};

export default ProductPrice;
