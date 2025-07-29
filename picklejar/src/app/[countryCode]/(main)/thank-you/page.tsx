"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { CheckCircleSolid } from "@medusajs/icons";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <CheckCircleSolid className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your order has been successfully placed. We'll start processing it
            right away.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Cash on Delivery (COD)</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <ul className="text-left space-y-2 text-blue-800">
            <li>• We'll confirm your order via email</li>
            <li>• Your order will be prepared and shipped</li>
            <li>• You'll receive delivery updates</li>
            <li>• Pay cash when your order arrives</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedClientLink href="/store">
            <Button size="large" variant="secondary">
              Continue Shopping
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/account/orders">
            <Button size="large">View My Orders</Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  );
}
