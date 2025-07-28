import { Metadata } from "next";
import AccountDashboard from "./AccountDashboard";

export const metadata: Metadata = {
  title: "Account Dashboard",
  description: "Manage your account and view your information.",
};

export default function OverviewTemplate() {
  return <AccountDashboard />;
}
