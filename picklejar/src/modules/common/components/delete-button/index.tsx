import { removeCartItem } from "@lib/client-cart";
import { Spinner, Trash } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import { useState } from "react";
import { toast } from "sonner";

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await removeCartItem(Number(id));
      // Toast is handled by the removeCartItem function
    } catch (err) {
      toast.error("Failed to delete item");
    }
    setIsDeleting(false);
  };

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className={clx(
          "flex gap-x-1 cursor-pointer transition-colors duration-200",
          className || "text-ui-fg-subtle hover:text-ui-fg-base"
        )}
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  );
};

export default DeleteButton;
