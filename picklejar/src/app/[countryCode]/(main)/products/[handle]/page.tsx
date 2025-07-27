import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, Product } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();

    return products
      .map((product: Product) => ({
        countryCode: "in",
        handle: product.name.toLowerCase(),
      }))
      .filter((param: { countryCode: string; handle: string }) => param.handle);
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    );
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { handle } = params;
  const region = await getRegion("in");

  if (!region) {
    notFound();
  }

  const products = await getAllProducts();

  const product = products.find(
    (p: Product) => p.name.toLowerCase() === handle
  );

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Pickle Jar`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Pickle Jar`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const region = await getRegion("in");

  if (!region) {
    notFound();
  }

  const products = await getAllProducts();

  const pricedProduct = products.find(
    (p: Product) => p.name.toLowerCase() === params.handle
  );

  if (!pricedProduct) {
    notFound();
  }

  return (
    <ProductTemplate product={pricedProduct} region={region} countryCode="in" />
  );
}
