import React from "react";
import { Button, Heading, Text } from "@medusajs/ui";
import { updateUserAddress } from "@lib/api";
import { toast } from "sonner";

type AddressBookProps = {
  customer: any;
};

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
  const handleUpdateAddress = async (formData: FormData) => {
    try {
      const addressData = {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
      };

      await updateUserAddress(addressData);
      toast.success("Address updated successfully");
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to update address");
    }
  };

  const currentAddress = customer?.address;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Heading level="h3" className="text-xl font-semibold mb-4">
          Current Address
        </Heading>

        {currentAddress ? (
          <div className="bg-gray-50 border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium text-gray-600">
                  Street Address
                </Text>
                <Text className="text-base">
                  {currentAddress.street || "Not provided"}
                </Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-600">City</Text>
                <Text className="text-base">
                  {currentAddress.city || "Not provided"}
                </Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-600">State</Text>
                <Text className="text-base">
                  {currentAddress.state || "Not provided"}
                </Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-600">
                  Pincode
                </Text>
                <Text className="text-base">
                  {currentAddress.pincode || "Not provided"}
                </Text>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <Text className="text-yellow-800">
              No address found. Please add your delivery address below.
            </Text>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <Heading level="h3" className="text-xl font-semibold mb-4">
          {currentAddress ? "Update Address" : "Add Address"}
        </Heading>

        <form action={handleUpdateAddress} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              required
              defaultValue={currentAddress?.street || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                defaultValue={currentAddress?.city || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                defaultValue={currentAddress?.state || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter state"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              name="pincode"
              required
              defaultValue={currentAddress?.pincode || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pincode"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {currentAddress ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressBook;
