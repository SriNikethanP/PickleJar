"use client";

import { CheckCircleSolid } from "@medusajs/icons";
import { Heading, Text } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ShippingProps = {
  cart: any;
  userDetails?: any;
};

const Shipping: React.FC<ShippingProps> = ({ cart, userDetails }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "delivery";

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false });
  };

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false });
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery
          {!isOpen && userDetails && <CheckCircleSolid />}
        </Heading>
        {!isOpen && userDetails && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-delivery-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      
      {isOpen ? (
        <div className="pb-8">
          <div className="flex flex-col">
            <span className="font-medium txt-medium text-ui-fg-base mb-2">
              Delivery Information
            </span>
            <span className="text-ui-fg-muted txt-medium mb-4">
              For COD orders, delivery details will be collected during payment step.
            </span>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text className="text-blue-800 text-sm">
                <strong>Standard Delivery:</strong> Free delivery for orders above ₹500. 
                Orders below ₹500 will have a delivery charge of ₹50.
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {userDetails ? (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Delivery Method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  Standard Delivery
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart?.subtotal >= 500 ? "Free" : "₹50"}
                </Text>
              </div>
            ) : (
              <div className="text-gray-500">
                Delivery method will be selected during payment step.
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Shipping;
