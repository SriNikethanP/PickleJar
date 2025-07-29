"use client";

import React, { useEffect, useActionState } from "react";
import Input from "@modules/common/components/input";
import AccountInfo from "../account-info";
import { updateUser } from "@lib/api";
import { toast } from "sonner";

type ProfileNameProps = {
  customer: any;
};

const ProfileName: React.FC<ProfileNameProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false);

  const updateCustomerName = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const userData = {
      fullName: formData.get("fullName") as string,
      mobile: formData.get("mobile") as string,
    };

    try {
      await updateUser(userData);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.toString() };
    }
  };

  const [state, formAction] = useActionState(
    async (...args) => {
      const result = await updateCustomerName(...args);
      if (result.success) {
        toast.success("Profile updated successfully");
      } else if (result.error) {
        toast.error(result.error || "Failed to update profile");
      }
      return result;
    },
    {
      error: false,
      success: false,
    }
  );

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  return (
    <form action={formAction} className="w-full overflow-visible">
      <AccountInfo
        label="Profile Information"
        currentInfo={`${customer?.fullName || "Not provided"} | ${
          customer?.mobile || "Not provided"
        }`}
        isSuccess={successState}
        isError={!!state?.error}
        clearState={clearState}
        data-testid="account-name-editor"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="fullName"
            required
            defaultValue={customer?.fullName ?? ""}
            data-testid="full-name-input"
          />
          <Input
            label="Mobile"
            name="mobile"
            required
            defaultValue={customer?.mobile ?? ""}
            data-testid="mobile-input"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileName;
