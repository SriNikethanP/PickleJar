import { Suspense } from "react";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ClientCartButton from "@modules/layout/components/cart-button/ClientCartButton";
import SideMenu from "@modules/layout/components/side-menu";
import ClientAccountButton from "@modules/layout/components/account-button/ClientAccountButton";

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Pickle Jar
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <ClientAccountButton />
            </div>
            <ClientCartButton />
          </div>
        </nav>
      </header>
    </div>
  );
}
