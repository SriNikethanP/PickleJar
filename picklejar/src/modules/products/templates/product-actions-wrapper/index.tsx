import { getAllProducts, Product } from "@lib/data/products";
import { HttpTypes } from "@medusajs/types";
import ProductActions from "@modules/products/components/product-actions";

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string;
  region: HttpTypes.StoreRegion;
}) {
  const products = await getAllProducts();

  const product = products.find((p: Product) => p.id === parseInt(id));

  if (!product) {
    return null;
  }

  return <ProductActions product={product} region={region} />;
}
