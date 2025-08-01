"use client";

import React from "react";
import { useAuth } from "@lib/context/auth-context";

import UnderlineLink from "@modules/common/components/interactive-link";

import ClientAccountNav from "../components/account-nav/ClientAccountNav";
import { HttpTypes } from "@medusajs/types";

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null;
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div
          className={`grid grid-cols-1 py-12 ${
            user ? "small:grid-cols-[240px_1fr]" : ""
          }`}
        >
          {user && (
            <div>
              <ClientAccountNav />
            </div>
          )}
          <div className="flex-1">{children}</div>
        </div>
        {user && (
          <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
            <div>
              <h3 className="text-xl-semi mb-4">Got questions?</h3>
              <span className="txt-medium">
                You can find frequently asked questions and answers on our
                customer service page.
              </span>
            </div>
            <div>
              <UnderlineLink href="/customer-service">
                Customer Service
              </UnderlineLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLayout;
