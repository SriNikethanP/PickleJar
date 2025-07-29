"use client";

import { CheckCircleSolid } from "@medusajs/icons";
import { Heading, Text, Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type ShippingProps = {
  cart: any;
  customer?: any;
  userDetails?: any;
  onAddressComplete?: (address: any) => void;
};

const Shipping: React.FC<ShippingProps> = ({
  cart,
  customer,
  userDetails,
  onAddressComplete,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "delivery";

  // User details state
  const [userInfo, setUserInfo] = useState({
    fullName: customer?.fullName || userDetails?.fullName || "",
    email: customer?.email || userDetails?.email || "",
    mobile: customer?.mobile || userDetails?.phone || "",
  });

  // Address state
  const [address, setAddress] = useState({
    street: customer?.address?.street || userDetails?.address || "",
    city: customer?.address?.city || userDetails?.city || "",
    state: customer?.address?.state || userDetails?.state || "",
    pincode: customer?.address?.pincode || userDetails?.pincode || "",
  });

  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    if (customer) {
      setUserInfo({
        fullName: customer.fullName || "",
        email: customer.email || "",
        mobile: customer.mobile || "",
      });
      setAddress({
        street: customer.address?.street || "",
        city: customer.address?.city || "",
        state: customer.address?.state || "",
        pincode: customer.address?.pincode || "",
      });
    } else if (userDetails) {
      setUserInfo({
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        mobile: userDetails.phone || "",
      });
      setAddress({
        street: userDetails.address || "",
        city: userDetails.city || "",
        state: userDetails.state || "",
        pincode: userDetails.pincode || "",
      });
    }
  }, [customer, userDetails]);

  const handleSelectAddress = () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.mobile) {
      toast.error("Please complete your contact information first");
      return;
    }

    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error("Please complete your delivery address first");
      return;
    }

    const deliveryDetails = {
      fullName: userInfo.fullName,
      email: userInfo.email,
      phone: userInfo.mobile,
      address: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    setSelectedAddress(deliveryDetails);

    if (onAddressComplete) {
      onAddressComplete(deliveryDetails);
    }

    // Navigate to payment step
    router.push(pathname + "?step=payment", { scroll: false });
  };

  const isUserInfoComplete =
    userInfo.fullName && userInfo.email && userInfo.mobile;
  const isAddressComplete =
    address.street && address.city && address.state && address.pincode;
  const isAllComplete = isUserInfoComplete && isAddressComplete;

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery Information
          {isAllComplete && <CheckCircleSolid />}
        </Heading>
      </div>

      {/* User Information Section */}
      <div className="mb-8">
        <div className="flex flex-row items-center justify-between mb-4">
          <Heading level="h3" className="text-xl font-semibold">
            Contact Information
          </Heading>
          <LocalizedClientLink href="/account/profile">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Edit in Profile
            </button>
          </LocalizedClientLink>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-sm font-medium text-gray-600">
                Full Name
              </Text>
              <Text className="text-base">
                {userInfo.fullName || "Not provided"}
              </Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600">Email</Text>
              <Text className="text-base">
                {userInfo.email || "Not provided"}
              </Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600">Mobile</Text>
              <Text className="text-base">
                {userInfo.mobile || "Not provided"}
              </Text>
            </div>
          </div>

          {!isUserInfoComplete && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text className="text-yellow-800 text-sm">
                Please complete your contact information in your profile before
                proceeding.
              </Text>
              <LocalizedClientLink href="/account/profile">
                <Button className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                  Go to Profile
                </Button>
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="mb-8">
        <div className="flex flex-row items-center justify-between mb-4">
          <Heading level="h3" className="text-xl font-semibold">
            Delivery Address
          </Heading>
          <LocalizedClientLink href="/account/addresses">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Manage Addresses
            </button>
          </LocalizedClientLink>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text className="text-sm font-medium text-gray-600">
                Street Address
              </Text>
              <Text className="text-base">
                {address.street || "Not provided"}
              </Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600">City</Text>
              <Text className="text-base">
                {address.city || "Not provided"}
              </Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600">State</Text>
              <Text className="text-base">
                {address.state || "Not provided"}
              </Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600">Pincode</Text>
              <Text className="text-base">
                {address.pincode || "Not provided"}
              </Text>
            </div>
          </div>

          {!isAddressComplete && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text className="text-yellow-800 text-sm">
                Please add a delivery address before proceeding.
              </Text>
              <LocalizedClientLink href="/account/addresses">
                <Button className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                  Add Address
                </Button>
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>

      {/* Continue to Payment Button */}
      {isAllComplete && (
        <div className="mt-6">
          <Button
            onClick={handleSelectAddress}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-lg font-medium w-full"
          >
            Continue to Payment
          </Button>
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  );
};

export default Shipping;
