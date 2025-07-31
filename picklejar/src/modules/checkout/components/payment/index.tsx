"use client";

import { Button, Container, Heading, Text, clx } from "@medusajs/ui";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { useCallback, useEffect, useState } from "react";
import { codCheckout } from "@lib/client-cart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorMessage from "../error-message";
import Divider from "@modules/common/components/divider";
import { toast } from "sonner";

const Payment = ({ cart, userDetails }: { cart: any; userDetails?: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get("step") === "payment";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "delivery"), {
      scroll: false,
    });
  };

  const handlePlaceOrder = async () => {
    if (!userDetails) {
      setError("Please provide delivery details first");
      toast.error("Please provide delivery details first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await codCheckout(userDetails);
      if (result && typeof result === 'object' && 'orderId' in result && 'totalAmount' in result) {
        toast.success("Order placed successfully!");
        // Redirect to thank you page with order details
        router.push(
          `/thank-you?orderId=${(result as any).orderId}&total=${(result as any).totalAmount}`
        );
      } else {
        toast.success("Order placed successfully!");
        router.push("/thank-you");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to place order";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Payment Method
          {!isOpen && userDetails && <CheckCircleSolid />}
        </Heading>
        {!isOpen && userDetails && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      {isOpen ? (
        <div className="pb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-green-600" />
              <div>
                <Text className="text-lg font-semibold">
                  Cash on Delivery (COD)
                </Text>
                <Text className="text-gray-600">
                  Pay when you receive your order
                </Text>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Subtotal:</Text>
                <Text>₹{cart?.subtotal || 0}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Shipping:</Text>
                <Text>{cart?.subtotal >= 500 ? "Free" : "₹50"}</Text>
              </div>
              <div className="flex justify-between">
                <Text>GST (18%):</Text>
                <Text>₹{cart?.gstTax || 0}</Text>
              </div>
              <Divider />
              <div className="flex justify-between font-semibold text-lg">
                <Text>Total:</Text>
                <Text>₹{cart?.total || 0}</Text>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handlePlaceOrder}
                disabled={isLoading || !userDetails}
                size="large"
                className="w-full"
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>

            {error && (
              <div className="mt-4">
                <ErrorMessage error={error} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {userDetails ? (
              <div className="flex flex-col gap-2">
                <Text className="txt-medium-plus text-ui-fg-base">
                  Payment Method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  Cash on Delivery (COD)
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  Total: ₹{cart?.total || 0}
                </Text>
              </div>
            ) : (
              <div className="text-gray-500">
                Please complete delivery details first.
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
