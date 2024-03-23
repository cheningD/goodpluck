import { useStore } from "@nanostores/solid";
import { $cart, $updateCartItems } from "src/lib/store";
import { Show, type Component } from "solid-js";
import {
  editItemQuantityCart,
  removeCartFromCart,
} from "src/lib/swell/cart/item";

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartButton: Component<AddToCartButtonProps> = ({ productId }) => {
  const { mutate } = useStore($updateCartItems)();
  const cart = useStore($cart);

  const handleQuantityChange = async (
    productId: string,
    quantity: number,
  ): Promise<void> => {
    const cartdata = cart();
    if (!cartdata) {
      throw new Error("Cart not found");
    }
    if (quantity === 0) {
      await removeCartFromCart(productId, cartdata, mutate);
    } else {
      await editItemQuantityCart(productId, quantity, cartdata, mutate);
    }
  };

  const getQuantity = (): number =>
    cart()?.items?.find((item) => item.product_id === productId)?.quantity ?? 0;

  return (
    <Show
      when={getQuantity()}
      fallback={
        <AddButton
          productId={productId}
          handleQuantityChange={handleQuantityChange}
        />
      }
    >
      <div class="flex items-baseline">
        <button
          aria-label="Decrease Quantity"
          type="button"
          class="mt-2 bg-brand-red text-white p-2"
          onClick={() => {
            void handleQuantityChange(productId, getQuantity() - 1);
          }}
        >
          {getQuantity() === 1 ? "Remove" : "-"}
        </button>
        <p class="mx-4">{getQuantity()}</p>
        <button
          aria-label="Increase Quantity"
          type="button"
          class="mt-2 bg-brand-red text-white p-2  hover:bg-blue-700"
          onClick={() => {
            void handleQuantityChange(productId, getQuantity() + 1);
          }}
        >
          +
        </button>
      </div>
    </Show>
  );
};
interface AddButtonProps {
  productId: string;
  handleQuantityChange: (productId: string, quantity: number) => Promise<void>;
}
const AddButton: Component<AddButtonProps> = ({
  productId,
  handleQuantityChange,
}) => {
  return (
    <button
      aria-label="Add to Cart"
      type="button"
      class="mt-2 bg-brand-red text-white p-2 rounded"
      onClick={() => {
        void handleQuantityChange(productId, 1);
      }}
    >
      Add
    </button>
  );
};

export { AddToCartButton };
