import Medusa from "@medusajs/js-sdk";

// Defaults to Spring Boot server port
let NEXT_PUBLIC_BACKEND_BASE_URL = "http://localhost:8080";

if (process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
  NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
}

export const sdk = new Medusa({
  baseUrl: NEXT_PUBLIC_BACKEND_BASE_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  // timeout: 5000, // 5 second timeout to prevent hanging requests
});
