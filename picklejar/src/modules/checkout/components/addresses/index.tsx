"use client";

import { CheckCircleSolid } from "@medusajs/icons";
import { Heading, Text } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Addresses = ({ cart, userDetails }: { cart: any; userDetails?: any }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "address";

  const handleEdit = () => {
    router.push(pathname + "?step=address");
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery Address
          {!isOpen && userDetails && <CheckCircleSolid />}
        </Heading>
        {!isOpen && userDetails && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      {isOpen ? (
        <div className="pb-8">
          <Text className="text-gray-600 mb-4">
            Delivery address will be collected during payment step for COD
            orders.
          </Text>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {userDetails ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/2"
                    data-testid="delivery-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Delivery Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {userDetails.fullName}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {userDetails.address}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {userDetails.city}, {userDetails.state} -{" "}
                      {userDetails.pincode}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/2"
                    data-testid="delivery-contact-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {userDetails.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {userDetails.email}
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Delivery address will be collected during payment step.
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Addresses;
