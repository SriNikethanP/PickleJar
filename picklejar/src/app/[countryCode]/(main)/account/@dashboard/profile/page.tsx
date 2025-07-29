import { Metadata } from "next";
import ProfileName from "@modules/account/components/profile-name";
import { notFound } from "next/navigation";
import { retrieveCustomer } from "@lib/data/customer";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Pickle Jar profile.",
};

export default async function Profile() {
  let customer = null;

  customer = await retrieveCustomer();

  if (!customer) {
    notFound();
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email,
          and mobile number.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">
                {customer?.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <p className="text-gray-900 capitalize">
                {customer?.role || "Customer"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />;
};
