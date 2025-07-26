import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { Button } from "@lib/components/ui/button";

export default function ShippingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
        <p className="text-gray-600">
          Manage shipping methods and delivery tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Shipping Methods</CardTitle>
              <Button>Add Method</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Standard Delivery
                    </h4>
                    <p className="text-sm text-gray-500">3-5 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹50</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Express Delivery
                    </h4>
                    <p className="text-sm text-gray-500">1-2 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹150</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Order #ORD-001
                  </h4>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    In Transit
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Expected delivery: 2024-01-18
                </p>
                <p className="text-sm text-gray-500">Tracking: TRK123456789</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Order #ORD-002
                  </h4>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Delivered on: 2024-01-16
                </p>
                <p className="text-sm text-gray-500">Tracking: TRK987654321</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
