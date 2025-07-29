import { Category } from "@lib/data/categories";
import { Product } from "@lib/data/products";
import { sortProducts } from "@lib/util/sort-products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ProductPreview from "@modules/products/components/product-preview";

type CategoryTemplateProps = {
  category: Category;
  countryCode: string;
  sortBy?: SortOptions;
  page?: string;
};

const CategoryTemplate = ({
  category,
  countryCode,
  sortBy,
  page,
}: CategoryTemplateProps) => {
  // Apply sorting to category products
  let products = category?.products || [];
  if (sortBy) {
    products = sortProducts(products, sortBy);
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((product: Product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/${countryCode}/products/${product.name.toLowerCase()}`}
          >
            <ProductPreview product={product} region={null} />
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  );
};

export default CategoryTemplate;
