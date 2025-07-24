import { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      countryCode: "in",
      queryParams: { limit: 100, fields: "handle" },
    });

    return response.products
      .map((product) => ({
        countryCode: "in",
        handle: product.handle,
      }))
      .filter((param) => param.handle);
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

  const { response } = await listProducts({
    countryCode: "in",
    queryParams: { limit: 100 },
  });

  const product = response.products.find((p) => p.handle === handle);

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

  const { response } = await listProducts({
    countryCode: "in",
    queryParams: { limit: 100 },
  });

  const pricedProduct = response.products.find(
    (p) => p.handle === params.handle
  );

  if (!pricedProduct) {
    notFound();
  }

  return (
    <ProductTemplate product={pricedProduct} region={region} countryCode="in" />
  );
}
