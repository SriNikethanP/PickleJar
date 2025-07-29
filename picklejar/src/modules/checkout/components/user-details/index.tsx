"use client";

import { useState, useEffect } from "react";
import { Button, Input, Text, Textarea } from "@medusajs/ui";
import { toast } from "sonner";
import { useAuth } from "@lib/context/auth-context";

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserDetailsProps {
  onComplete: (details: UserDetails) => void;
  isLoading?: boolean;
}

const UserDetails = ({ onComplete, isLoading = false }: UserDetailsProps) => {
  const { user } = useAuth();
  const [details, setDetails] = useState<UserDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill with user data if available
  useEffect(() => {
    if (user) {
      setDetails((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.mobile || "",
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};

    if (!details.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!details.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!details.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(details.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!details.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!details.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!details.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!details.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(details.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onComplete(details);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      toast.success("Details updated successfully");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (user) {
      setDetails((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.mobile || "",
      }));
    }
    setErrors({});
  };

  if (
    !isEditing &&
    user &&
    details.fullName &&
    details.email &&
    details.phone
  ) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text className="text-lg font-semibold">Delivery Details</Text>
          <Button variant="secondary" size="small" onClick={handleEdit}>
            Edit
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">Name:</Text>
            <Text className="text-sm font-medium">{details.fullName}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">Email:</Text>
            <Text className="text-sm font-medium">{details.email}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">Phone:</Text>
            <Text className="text-sm font-medium">{details.phone}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">Address:</Text>
            <Text className="text-sm font-medium">{details.address}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">City:</Text>
            <Text className="text-sm font-medium">{details.city}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">State:</Text>
            <Text className="text-sm font-medium">{details.state}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm text-gray-600">Pincode:</Text>
            <Text className="text-sm font-medium">{details.pincode}</Text>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
          size="large"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Text className="text-lg font-semibold">Delivery Details</Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name"
            value={details.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={errors.fullName}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            value={details.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            value={details.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="Enter 10-digit phone number"
          />
        </div>

        <div>
          <Input
            label="Pincode"
            value={details.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            error={errors.pincode}
            placeholder="Enter 6-digit pincode"
          />
        </div>
      </div>

      <div>
        <Textarea
          label="Address"
          value={details.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={errors.address}
          placeholder="Enter your complete address"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="City"
            value={details.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            error={errors.city}
            placeholder="Enter your city"
          />
        </div>

        <div>
          <Input
            label="State"
            value={details.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            error={errors.state}
            placeholder="Enter your state"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
          size="large"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>

        {isEditing && (
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
