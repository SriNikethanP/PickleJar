import { Metadata } from "next";
import { notFound } from "next/navigation";

import { listCollections } from "@lib/data/collections";
// import { listRegions } from "@lib/data/regions";
import CollectionTemplate from "@modules/collections/templates";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

type Props = {
  params: Promise<{ handle: string; countryCode: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: SortOptions;
  }>;
};

export const PRODUCT_LIMIT = 12;

export async function generateStaticParams() {
  const collections = await listCollections();

  if (!collections) {
    return [];
  }

  // const countryCodes = await listRegions().then(
  //   (regions: StoreRegion[]) =>
  //     regions
  //       ?.map((r) => r.countries?.map((c) => c.iso_2))
  //       .flat()
  //       .filter(Boolean) as string[]
  // );

  const collectionHandles = collections
    .map((collection: any) => {
      if (!collection.title) {
        console.warn("Collection without title found:", collection);
        return null;
      }
      return collection.title.toLowerCase().replace(/\s+/g, "-");
    })
    .filter((handle): handle is string => handle !== null);

  const staticParams = [
    { countryCode: "IN", handle: "all-products" },
    ...collectionHandles.map((handle: string) => ({
      countryCode: "IN",
      handle,
    })),
  ];

  console.log("Generated static params for collections:", staticParams);
  return staticParams;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const collections = await listCollections();
  const collection = collections.find(
    (col) => col.title?.toLowerCase().replace(/\s+/g, "-") === params.handle
  );

  if (!collection) {
    notFound();
  }

  const metadata = {
    title: `${collection.title} | Pickle Jar`,
    description: `${collection.title} collection`,
  } as Metadata;

  return metadata;
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sortBy, page } = searchParams;

  const collections = await listCollections();
  const collection = collections.find(
    (col) => col.title?.toLowerCase().replace(/\s+/g, "-") === params.handle
  );

  if (!collection) {
    notFound();
  }

  return (
    <CollectionTemplate
      collection={collection as any}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
    />
  );
}
