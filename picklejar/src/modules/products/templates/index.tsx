import ProductActions from "@modules/products/components/product-actions";
import ProductInfo from "@modules/products/templates/product-info";
import ProductTabs from "@modules/products/components/product-tabs";
import RelatedProducts from "@modules/products/components/related-products";
import ImageGallery from "@modules/products/components/image-gallery";
import { Suspense } from "react";
import Skeleton from "@modules/skeletons/components/skeleton";

type ProductTemplateProps = {
  product: any;
  region: any;
  countryCode: string;
};

export default function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <a
                  href="/store"
                  className="ml-1 text-gray-700 hover:text-gray-900 md:ml-2"
                >
                  Products
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <ImageGallery images={product.imageUrls} />
            </div>

            {/* Product Info and Actions */}
            <div className="space-y-6 z-10">
              <ProductInfo product={product} />
              <ProductActions product={product} region={region} />
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm">
            <Suspense fallback={<Skeleton className="w-full h-[473px]" />}>
              <ProductTabs product={product} />
            </Suspense>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <Suspense fallback={<Skeleton className="w-full h-[473px]" />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
