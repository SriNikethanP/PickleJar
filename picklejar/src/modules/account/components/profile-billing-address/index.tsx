"use client";

import React, { useEffect, useMemo, useActionState } from "react";

import Input from "@modules/common/components/input";
import NativeSelect from "@modules/common/components/native-select";
import { toast } from "sonner";

import AccountInfo from "../account-info";
import { HttpTypes } from "@medusajs/types";
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer";

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer;
};

const ProfileBillingAddress: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false);

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  );

  const initialState: Record<string, any> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  };

  if (billingAddress) {
    initialState.addressId = billingAddress.id;
  }

  const [state, formAction] = useActionState(async (...args) => {
    const result = await (billingAddress
      ? updateCustomerAddress
      : addCustomerAddress)(...args);
    if (result.success) {
      toast.success("Billing address updated successfully");
    } else if (result.error) {
      toast.error(result.error || "Failed to update billing address");
    }
    return result;
  }, initialState);

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "No billing address";
    }

    const country = "India";

    return (
      <div className="flex flex-col font-semibold" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        <span>{billingAddress.company}</span>
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
      </div>
    );
  }, [billingAddress]);

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <input type="hidden" name="addressId" value={billingAddress?.id} />
      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First name"
              name="first_name"
              defaultValue={billingAddress?.first_name || undefined}
              required
              data-testid="billing-first-name-input"
            />
            <Input
              label="Last name"
              name="last_name"
              defaultValue={billingAddress?.last_name || undefined}
              required
              data-testid="billing-last-name-input"
            />
          </div>
          <Input
            label="Company"
            name="company"
            defaultValue={billingAddress?.company || undefined}
            data-testid="billing-company-input"
          />
          <Input
            label="Address"
            name="address_1"
            defaultValue={billingAddress?.address_1 || undefined}
            required
            data-testid="billing-address-1-input"
          />
          <Input
            label="Apartment, suite, etc."
            name="address_2"
            defaultValue={billingAddress?.address_2 || undefined}
            data-testid="billing-address-2-input"
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              name="postal_code"
              defaultValue={billingAddress?.postal_code || undefined}
              required
              data-testid="billing-postcal-code-input"
            />
            <Input
              label="City"
              name="city"
              defaultValue={billingAddress?.city || undefined}
              required
              data-testid="billing-city-input"
            />
          </div>
          <Input
            label="Province"
            name="province"
            defaultValue={billingAddress?.province || undefined}
            data-testid="billing-province-input"
          />
          <NativeSelect
            name="country_code"
            defaultValue={billingAddress?.country_code || "in"}
            required
            data-testid="billing-country-code-select"
          >
            <option value="in">India</option>
          </NativeSelect>
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileBillingAddress;
