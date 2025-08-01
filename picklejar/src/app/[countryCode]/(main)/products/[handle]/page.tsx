import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";

// Helper function to generate URL-safe handles
function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();

    return products
      .map((product: any) => {
        if (!product.name) {
          console.warn("Product without name found:", product);
          return null;
        }
        return {
          countryCode: "in",
          handle: product.name.toLowerCase().replace(/\s+/g, "-"),
        };
      })
      .filter(
        (param): param is { countryCode: string; handle: string } =>
          param !== null && Boolean(param.handle) && param.handle.length > 0
      );
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

  const product = products.find((p: any) => generateHandle(p.name) === handle);

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
  const { handle } = params;

  // Fetch region and products in parallel
  const [region, products] = await Promise.all([
    getRegion("in"),
    getAllProducts(),
  ]);

  if (!region) {
    notFound();
  }

  // Debug: Log the handle we're looking for and available products
  console.log("Looking for handle:", handle);
  console.log(
    "Available products:",
    products.map((p: any) => ({
      name: p.name,
      generatedHandle: generateHandle(p.name),
    }))
  );

  const product = products.find((p: any) => generateHandle(p.name) === handle);

  if (!product) {
    console.log("Product not found for handle:", handle);
    notFound();
  }

  return <ProductTemplate product={product} region={region} countryCode="in" />;
}
