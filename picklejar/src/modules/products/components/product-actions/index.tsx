"use client";

import { addToCartWrapper } from "@lib/data/cart";
import { useIntersection } from "@lib/hooks/use-in-view";
import { Product } from "@lib/data/products";
import { Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductPrice from "../product-price";
import MobileActions from "./mobile-actions";
import { toast } from "sonner";

type ProductActionsProps = {
  product: Product;
  region: any;
  disabled?: boolean;
};

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const countryCode = "in";

  // check if the product is in stock
  const inStock = product.stock > 0;

  const actionsRef = useRef<HTMLDivElement>(null);

  const inView = useIntersection(actionsRef, "0px");

  // add the product to the cart
  const handleAddToCart = async () => {
    if (!product.id) return null;

    setIsAdding(true);

    try {
      await addToCartWrapper({
        productId: product.id,
        quantity: 1,
        countryCode,
      });
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div className="flex flex-col gap-y-2">
          <ProductPrice product={product} />
          <Button
            onClick={handleAddToCart}
            disabled={disabled || !inStock || isAdding}
            className="w-full"
            size="lg"
          >
            {!inStock ? "Out of stock" : isAdding ? "Adding..." : "Add to cart"}
          </Button>
        </div>
      </div>
      <MobileActions
        product={product}
        region={region}
        disabled={disabled}
        inStock={inStock}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
      />
    </>
  );
}
