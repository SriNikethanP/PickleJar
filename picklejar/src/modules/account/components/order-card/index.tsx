// import { Button } from "@medusajs/ui";
import { useMemo } from "react";

import Thumbnail from "@modules/products/components/thumbnail";
import { convertToLocale } from "@lib/util/money";
import { CustomOrder } from "@lib/data/orders";

type OrderCardProps = {
  order: CustomOrder;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + (item.quantity || 0);
      }, 0) ?? 0
    );
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0;
  }, [order]);

  // Handle missing or undefined order data
  if (!order) {
    return (
      <div className="bg-white flex flex-col p-4" data-testid="order-card">
        <div className="text-gray-500">Order data not available</div>
      </div>
    );
  }

  console.log("OrderCard rendering order:", order);
  console.log("Order items:", order.items);

  return (
    <div className="bg-white flex flex-col" data-testid="order-card">
      <div className="uppercase text-large-semi mb-1">
        #<span data-testid="order-display-id">{order.display_id || "N/A"}</span>
      </div>
      <div className="flex items-center divide-x divide-gray-200 text-small-regular text-ui-fg-base">
        <span className="pr-2" data-testid="order-created-at">
          {order.created_at ? new Date(order.created_at).toDateString() : "N/A"}
        </span>
        <span className="px-2" data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="pl-2">{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 my-4">
        {order.items?.slice(0, 4).map((i) => {
          console.log("Rendering order item:", i);
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Thumbnail
                thumbnail={i.thumbnail || i.product?.imageUrls?.[0]}
                images={
                  i.product?.imageUrls?.map((url: string) => ({ url })) || []
                }
                size="full"
              />
              <div className="flex items-center text-small-regular text-ui-fg-base">
                <span
                  className="text-ui-fg-base font-semibold"
                  data-testid="item-title"
                >
                  {i.title || i.product?.name || "Unknown Product"}
                </span>
                <span className="ml-2">x</span>
                <span data-testid="item-quantity">{i.quantity || 0}</span>
              </div>
            </div>
          );
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-small-regular text-ui-fg-base">
              + {numberOfLines - 4}
            </span>
            <span className="text-small-regular text-ui-fg-base">more</span>
          </div>
        )}
      </div>
      {/* <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button data-testid="order-details-link" variant="secondary">
            See details
          </Button>
        </LocalizedClientLink>
      </div> */}
    </div>
  );
};

export default OrderCard;
