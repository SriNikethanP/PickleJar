import { Metadata } from "next";
import ClientRegister from "@modules/account/components/register/ClientRegister";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account.",
};

export default function RegisterPage() {
  return <ClientRegister />;
}
