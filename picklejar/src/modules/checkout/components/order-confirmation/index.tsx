"use client";

import { Button, Container, Heading, Text } from "@medusajs/ui";
import { CheckCircleSolid } from "@medusajs/icons";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

interface OrderConfirmationProps {
  orderId?: string;
  totalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
}

const OrderConfirmation = ({
  orderId,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
}: OrderConfirmationProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <CheckCircleSolid className="w-16 h-16 text-green-500" />
        </div>

        <Heading level="h1" className="mb-2">
          Order Confirmed!
        </Heading>

        <Text className="text-gray-600 mb-8 max-w-md">
          Thank you for your order. We've received your payment and will process
          your order shortly.
        </Text>

        <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Text className="text-sm text-gray-600">Order ID:</Text>
              <Text className="text-sm font-medium">{orderId || "N/A"}</Text>
            </div>

            <div className="flex justify-between">
              <Text className="text-sm text-gray-600">Total Amount:</Text>
              <Text className="text-sm font-medium">
                ₹{totalAmount?.toFixed(2) || "0.00"}
              </Text>
            </div>

            <div className="flex justify-between">
              <Text className="text-sm text-gray-600">Payment Method:</Text>
              <Text className="text-sm font-medium">
                Cash on Delivery (COD)
              </Text>
            </div>

            <div className="border-t pt-3 mt-3">
              <Text className="text-sm font-medium mb-2">
                Delivery Details:
              </Text>
              <div className="space-y-1 text-sm text-gray-600">
                <div>{customerName}</div>
                <div>{customerEmail}</div>
                <div>{customerPhone}</div>
                <div className="mt-2">{shippingAddress}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg w-full max-w-md mb-8">
          <Text className="text-sm text-blue-800">
            <strong>Important:</strong> Please have the exact amount ready when
            the delivery person arrives. You will receive a confirmation email
            and SMS with tracking details shortly.
          </Text>
        </div>

        <div className="flex gap-4">
          <LocalizedClientLink href="/store">
            <Button variant="secondary">Continue Shopping</Button>
          </LocalizedClientLink>

          <LocalizedClientLink href="/account">
            <Button>View Orders</Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
