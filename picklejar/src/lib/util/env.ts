export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://localhost:8080";
}
