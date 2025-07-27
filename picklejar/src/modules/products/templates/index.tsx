import { Product } from "@lib/data/products";
import ProductActions from "@modules/products/components/product-actions";
import ProductInfo from "@modules/products/templates/product-info";
import ProductTabs from "@modules/products/components/product-tabs";
import RelatedProducts from "@modules/products/components/related-products";
import ImageGallery from "@modules/products/components/image-gallery";
import { Suspense } from "react";
import Skeleton from "@modules/skeletons/components/skeleton";

type ProductTemplateProps = {
  product: Product;
  region: any;
  countryCode: string;
};

export default function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  return (
    <>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6">
        <div className="relative flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8">
          <ProductInfo product={product} />
          <ProductActions product={product} region={region} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product.imageUrls} />
        </div>
      </div>
      <div className="content-container flex flex-col small:flex-row small:items-start py-16">
        <Suspense fallback={<Skeleton className="w-full h-[473px]" />}>
          <ProductTabs product={product} />
        </Suspense>
      </div>
      <div className="content-container flex flex-col small:flex-row small:items-start py-16">
        <Suspense fallback={<Skeleton className="w-full h-[473px]" />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  );
}
