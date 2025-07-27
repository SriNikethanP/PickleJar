import { getAllProducts, Product } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import ProductPreview from "@modules/products/components/product-preview";
import { Pagination } from "@modules/store/components/pagination";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

const PRODUCT_LIMIT = 12;
type Products = Product[];
export default async function PaginatedProducts({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions;
  page: number;
  countryCode: string;
}) {
  let region = null;
  let products: Product[] = [];
  let count = 0;

  try {
    region = await getRegion(countryCode);

    if (!region) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Region Not Found</h2>
          <p className="text-gray-600">
            The requested region is not available.
          </p>
        </div>
      );
    }

    // Map sortBy to the correct parameters for listProducts
    let sortByParam: "updatedAt" | "price" = "updatedAt";
    let order: "asc" | "desc" = "desc";

    switch (sortBy) {
      case "latest":
        sortByParam = "updatedAt";
        order = "desc";
        break;
      case "price_asc":
        sortByParam = "price";
        order = "asc";
        break;
      case "price_desc":
        sortByParam = "price";
        order = "desc";
        break;
      default:
        sortByParam = "updatedAt";
        order = "desc";
    }

    const result = await getAllProducts();

    products = result || [];
    count = result.length || 0;
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Products</h2>
        <p className="text-gray-600">
          There was an error loading the products. Please try again later.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
        <p className="text-gray-600">No products are currently available.</p>
      </div>
    );
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((product) => {
          return (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          );
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
