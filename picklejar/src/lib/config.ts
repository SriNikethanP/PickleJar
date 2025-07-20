import Medusa from "@medusajs/js-sdk";

// Defaults to Spring Boot server port
let MEDUSA_BACKEND_URL = "http://localhost:8080";

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL;
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  // timeout: 5000, // 5 second timeout to prevent hanging requests
});
