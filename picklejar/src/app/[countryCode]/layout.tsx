import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PickleJar",
  description: "Fresh and delicious pickles",
};

export default function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ countryCode: string }>;
}) {
  return <>{children}</>;
}
