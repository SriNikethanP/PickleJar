import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  let region = null;
  let products = [];
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

    const result = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    });

    products = result.response.products || [];
    count = result.response.count || 0;
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

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
        <p className="text-gray-600">
          No products match your current filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
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
  )
}
