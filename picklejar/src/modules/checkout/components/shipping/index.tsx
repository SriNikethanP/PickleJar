"use client";

import { CheckCircleSolid } from "@medusajs/icons";
import { Heading, Text, Input, Label, Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateUserAddress } from "@lib/api";

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

  const [address, setAddress] = useState({
    fullName: customer?.fullName || userDetails?.fullName || "",
    email: customer?.email || userDetails?.email || "",
    phone: customer?.mobile || userDetails?.phone || "",
    address: customer?.address?.street || userDetails?.address || "",
    city: customer?.address?.city || userDetails?.city || "",
    state: customer?.address?.state || userDetails?.state || "",
    pincode: customer?.address?.pincode || userDetails?.pincode || "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setAddress({
        fullName: customer.fullName || "",
        email: customer.email || "",
        phone: customer.mobile || "",
        address: customer.address?.street || "",
        city: customer.address?.city || "",
        state: customer.address?.state || "",
        pincode: customer.address?.pincode || "",
      });
    } else if (userDetails) {
      setAddress({
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        address: userDetails.address || "",
        city: userDetails.city || "",
        state: userDetails.state || "",
        pincode: userDetails.pincode || "",
      });
    }
  }, [customer, userDetails]);

  const validateAddress = () => {
    const newErrors: any = {};
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.email.trim()) newErrors.email = "Email is required";
    if (!address.phone.trim()) newErrors.phone = "Phone is required";
    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSaveAddress = async () => {
    if (!validateAddress()) {
      return;
    }

    setIsSaving(true);
    try {
      // Save address to user profile
      const addressData = {
        street: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      };

      await updateUserAddress(addressData);

      if (onAddressComplete) {
        onAddressComplete(address);
      }
      setIsEditing(false);
      toast.success("Address saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePlaceOrder = () => {
    if (!validateAddress()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (onAddressComplete) {
      onAddressComplete(address);
    }

    // Navigate to payment step to place order
    router.push(pathname + "?step=payment", { scroll: false });
  };

  const isAddressComplete =
    address.fullName &&
    address.email &&
    address.phone &&
    address.address &&
    address.city &&
    address.state &&
    address.pincode;

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery Address
          {isAddressComplete && !isEditing && <CheckCircleSolid />}
        </Heading>
        {isAddressComplete && !isEditing && (
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

      {isEditing || !isAddressComplete ? (
        <div className="pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={address.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <Text className="text-red-500 text-sm">{errors.fullName}</Text>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm">{errors.email}</Text>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={address.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <Text className="text-red-500 text-sm">{errors.phone}</Text>
              )}
            </div>

            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={address.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                className={errors.pincode ? "border-red-500" : ""}
              />
              {errors.pincode && (
                <Text className="text-red-500 text-sm">{errors.pincode}</Text>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <Text className="text-red-500 text-sm">{errors.address}</Text>
              )}
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <Text className="text-red-500 text-sm">{errors.city}</Text>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <Text className="text-red-500 text-sm">{errors.state}</Text>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing && (
              <Button
                onClick={handleSaveAddress}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Address"}
              </Button>
            )}
            {isAddressComplete && (
              <Button
                onClick={handlePlaceOrder}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Place Order
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            <div className="flex flex-col gap-2">
              <Text className="txt-medium-plus text-ui-fg-base">
                Delivery Address
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {address.fullName}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {address.address}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {address.city}, {address.state} - {address.pincode}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                Phone: {address.phone}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                Email: {address.email}
              </Text>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Shipping;
