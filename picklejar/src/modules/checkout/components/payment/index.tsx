"use client";

import {
  Button,
  Container,
  Heading,
  RadioGroup,
  Text,
  clx,
} from "@medusajs/ui";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { useCallback, useEffect, useState } from "react";
import { codCheckout } from "@lib/client-cart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorMessage from "../error-message";
import Divider from "@modules/common/components/divider";
import UserDetails from "../user-details";

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any;
  availablePaymentMethods: any[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cod"); // Default to COD
  const [userDetails, setUserDetails] = useState<any>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get("step") === "payment";

  // COD only payment system

  const setPaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  const paymentReady = cart?.items?.length > 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (selectedPaymentMethod === "cod") {
        // For COD, we need user details
        if (!userDetails) {
          setError("Please provide delivery details");
          setIsLoading(false);
          return;
        }

        // Proceed to review step for COD
        router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        });
      } else {
        setError("Only COD payment is currently available");
      }
    } catch (err: any) {
      setError(err.message);
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
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
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
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-blue-50">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              checked={selectedPaymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <label htmlFor="cod" className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Cash on Delivery (COD)</span>
            </label>
          </div>

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          {selectedPaymentMethod === "cod" && (
            <div className="mt-6">
              <UserDetails
                onComplete={async (details) => {
                  setUserDetails(details);
                  setIsLoading(true);
                  try {
                    const result = await codCheckout({
                      cartId: cart?.id,
                      ...details,
                    });
                    if (result) {
                      router.push(
                        pathname + "?" + createQueryString("step", "review"),
                        { scroll: false }
                      );
                    }
                  } catch (error) {
                    console.error("COD checkout error:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* COD only - no other payment methods */}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && selectedPaymentMethod === "cod" && userDetails ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  Cash on Delivery (COD)
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Delivery details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    <CreditCard />
                  </Container>
                  <Text>
                    {userDetails.fullName} - {userDetails.phone}
                  </Text>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

// COD payment info
const paymentInfoMap: Record<string, { title: string; icon: React.ReactNode }> =
  {
    cod: {
      title: "Cash on Delivery",
      icon: <CreditCard />,
    },
  };

export default Payment;
