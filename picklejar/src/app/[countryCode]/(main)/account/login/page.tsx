import { Metadata } from "next";
import ClientLogin from "@modules/account/components/login/ClientLogin";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return <ClientLogin />;
}
