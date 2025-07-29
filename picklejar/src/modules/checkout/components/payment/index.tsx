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
import { initiatePaymentSession } from "@lib/data/cart";
import { codCheckout } from "@lib/client-cart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isStripe } from "@lib/util/payment";
import ErrorMessage from "../error-message";
import Divider from "@modules/common/components/divider";
import StripeCardContainer from "../payment-wrapper/stripe-wrapper";
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
    useState<string>("");
  const [cardComplete, setCardComplete] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get("step") === "payment";

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  );

  const isStripeFunc = (providerId: string) => isStripe(providerId);

  const setPaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method);
    setError(null);

    if (method !== activeSession?.provider_id) {
      try {
        await initiatePaymentSession(cart, {
          provider_id: method,
        });
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const paymentReady = activeSession && cart?.shipping_methods.length !== 0;

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
        // Handle other payment methods (Stripe, etc.)
        const shouldInputCard =
          isStripeFunc(selectedPaymentMethod) && !activeSession;

        const checkActiveSession =
          activeSession?.provider_id === selectedPaymentMethod;

        if (!checkActiveSession) {
          await initiatePaymentSession(cart, {
            provider_id: selectedPaymentMethod,
          });
        }

        if (!shouldInputCard) {
          return router.push(
            pathname + "?" + createQueryString("step", "review"),
            {
              scroll: false,
            }
          );
        }
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
          {availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {/* Stripe payment temporarily disabled
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    ) : null}
                  </div>
                ))}
                */}
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
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
              </RadioGroup>
            </>
          )}

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

          {selectedPaymentMethod !== "cod" && (
            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={(isStripe && !cardComplete) || !selectedPaymentMethod}
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripeFunc(selectedPaymentMethod)
                ? " Enter card details"
                : "Continue to review"}
            </Button>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
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

const paymentInfoMap: Record<string, { title: string; icon: React.ReactNode }> =
  {
    stripe: {
      title: "Credit card",
      icon: <CreditCard />,
    },
    manual: {
      title: "Manual payment",
      icon: <CreditCard />,
    },
  };

export default Payment;
