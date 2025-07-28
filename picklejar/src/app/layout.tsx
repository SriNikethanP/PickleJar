import { getBaseURL } from "@lib/util/env";
import { Metadata } from "next";
import "styles/globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@lib/context/auth-context";

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
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
