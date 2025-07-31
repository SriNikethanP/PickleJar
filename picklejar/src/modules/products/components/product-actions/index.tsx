"use client";

import { useIntersection } from "@lib/hooks/use-in-view";
import { Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductPrice from "../product-price";
import MobileActions from "./mobile-actions";
import { useCart } from "@lib/context/cart-context";
import { useAuth } from "@lib/context/auth-context";

type ProductActionsProps = {
  product: any;
  region: any;
  disabled?: boolean;
};

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const countryCode = "in";

  // check if the product is in stock
  const inStock = product.stock > 0;

  const actionsRef = useRef<HTMLDivElement>(null);

  const inView = useIntersection(actionsRef, "0px");

  const router = useRouter();

  // add the product to the cart
  const handleAddToCart = async () => {
    if (!product.id) return null;
    if (!user) {
      // Redirect to login page when user is not authenticated
      router.push("/account/login");
      return;
    }

    setIsAdding(true);

    try {
      const success = await addToCart(product.id, 1);
      if (!success) {
        throw new Error("Failed to add to cart");
      }
    } catch (err: any) {
      console.error("Failed to add to cart:", err);
      // The error toast is already handled in the cart context
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
