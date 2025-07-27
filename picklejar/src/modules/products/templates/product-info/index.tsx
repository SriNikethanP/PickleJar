import { Product } from "@lib/data/products";
import ProductPrice from "@modules/products/components/product-price";

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
      </div>
      <ProductPrice product={product} />
    </div>
  );
};

export default ProductInfo;
