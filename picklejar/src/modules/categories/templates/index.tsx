import { Category } from "@lib/data/categories";
import { getAllProducts, Product } from "@lib/data/products";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ProductPreview from "@modules/products/components/product-preview";

type CategoryTemplateProps = {
  category: Category;
  countryCode: string;
};

const CategoryTemplate = ({ category, countryCode }: CategoryTemplateProps) => {
  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8">
        {category.products.map((product: Product) => (
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
