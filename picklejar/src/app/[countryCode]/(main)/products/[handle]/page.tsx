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
        handle: product.name.toLowerCase().replace(/\s+/g, "-"),
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
    (p: Product) => p.name.toLowerCase().replace(/\s+/g, "-") === handle
  );

  if (!product) {
    notFound();
  }

  return {
    title: `${product.name} | Pickle Jar`,
    description:
      product.description ||
      `${product.name} - Fresh and delicious pickles from Pickle Jar`,
    openGraph: {
      title: `${product.name} | Pickle Jar`,
      description:
        product.description ||
        `${product.name} - Fresh and delicious pickles from Pickle Jar`,
      images:
        product.imageUrls && product.imageUrls.length > 0
          ? [product.imageUrls[0]]
          : [],
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

  const product = products.find(
    (p: Product) => p.name.toLowerCase().replace(/\s+/g, "-") === params.handle
  );

  if (!product) {
    notFound();
  }

  return <ProductTemplate product={product} region={region} countryCode="in" />;
}
