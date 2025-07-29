"use client";

import { Table, Text, clx } from "@medusajs/ui";
import { updateLineItem } from "@lib/client-cart";
import CartItemSelect from "@modules/cart/components/cart-item-select";
import ErrorMessage from "@modules/checkout/components/error-message";
import DeleteButton from "@modules/common/components/delete-button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Spinner from "@modules/common/icons/spinner";
import { useState } from "react";

type ItemProps = {
  item: any;
  type?: "full" | "preview";
  currencyCode: string;
};

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    await updateLineItem({
      lineId: item.cartItemId.toString(),
      quantity,
    })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10;
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory;

  // Handle cases where item might be undefined
  if (!item) {
    return null; // Don't render anything if item is invalid
  }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.productId}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <img
            src={item.imageUrls?.[0] || "/placeholder.png"}
            alt={item.productName || "Product"}
            className="w-24 h-24 object-cover rounded"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.productName || "Unknown Product"}
        </Text>
        {item.productDescription && (
          <Text className="txt-small text-ui-fg-subtle mt-1">
            {item.productDescription}
          </Text>
        )}
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <CartItemSelect
                value={item.quantity}
                onChange={(value) =>
                  changeQuantity(parseInt(value.target.value))
                }
                className="w-20 h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                data-testid="product-select-button"
              >
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i} className="py-1">
                      {i + 1}
                    </option>
                  )
                )}
              </CartItemSelect>
              {updating && <Spinner />}
            </div>
            <DeleteButton
              id={item.cartItemId}
              data-testid="product-delete-button"
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            />
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <span className="text-base-regular">₹{item.price || 0}</span>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity || 0}x </Text>
              <span className="text-base-regular">₹{item.price || 0}</span>
            </span>
          )}
          <span className="text-base-regular font-semibold">
            ₹{(item.price || 0) * (item.quantity || 0)}
          </span>
        </span>
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;
