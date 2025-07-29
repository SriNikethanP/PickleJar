import { redirect } from "next/navigation";

export default function AccountPage() {
  // This page will be intercepted by the parallel routes
  // The layout will show login by default for unauthenticated users
  // and dashboard for authenticated users
  return null;
}
