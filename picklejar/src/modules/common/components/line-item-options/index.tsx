import { Product } from "@lib/data/products";

type LineItemOptionsProps = {
  product: Product;
  "data-value"?: Product;
};

const LineItemOptions = ({ product }: LineItemOptionsProps) => {
  return (
    <div className="text-small-regular text-gray-700">
      <span>{product.name}</span>
    </div>
  );
};

export default LineItemOptions;
