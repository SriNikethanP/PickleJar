import { getBaseURL } from "@lib/util/env";
import { Metadata } from "next";
import "styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
