import { Dialog, Transition } from "@headlessui/react";
import { Button, clx } from "@medusajs/ui";
import React, { Fragment, useMemo } from "react";

import useToggleState from "@lib/hooks/use-toggle-state";
import ChevronDown from "@modules/common/icons/chevron-down";
import X from "@modules/common/icons/x";
import { Product } from "@lib/data/products";

type MobileActionsProps = {
  product: Product;
  region: any;
  disabled?: boolean;
  inStock?: boolean;
  onAddToCart: () => void;
  isAdding?: boolean;
};

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  region,
  disabled,
  inStock,
  onAddToCart,
  isAdding,
}) => {
  const { state, open, close } = useToggleState();

  const price = product.price;

  return (
    <>
      <div className="lg:hidden inset-x-0 bottom-0 fixed">
        <div
          className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200"
          data-testid="mobile-actions"
        >
          <div className="flex items-center gap-x-2">
            <span data-testid="mobile-title">{product.name}</span>
            <span>—</span>
            <div className="flex items-end gap-x-2 text-ui-fg-base">
              <span>₹{price}</span>
            </div>
          </div>

          <Button
            onClick={onAddToCart}
            disabled={disabled || !inStock || isAdding}
            className="w-full"
            size="lg"
          >
            {!inStock ? "Out of stock" : isAdding ? "Adding..." : "Add to cart"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileActions;
