import { useStore } from "@nanostores/solid";
import { $cart, $updateCartItems, $isCartOpen } from "src/lib/store";

import { Show, type Component } from "solid-js";
import {
  editItemQuantityCart,
  removeItemFromCart,
} from "src/lib/swell/cart/item";
import Spinner from "./Spinner";

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
    if (!cartdata.shipping?.zip) {
      $isCartOpen.set(true);
    }
    if (quantity === 0) {
      await removeItemFromCart(productId, cartdata, mutate);
    } else {
      await editItemQuantityCart(productId, quantity, cartdata, mutate);
    }
  };

  const getQuantity = (): number =>
    cart()?.items?.find((item) => item.product_id === productId)?.quantity ?? 0;

  return (
    <Show
      when={cart()}
      fallback={
        <div class="h-[48px] flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <Show
        when={getQuantity()}
        fallback={
          <AddButton
            productId={productId}
            handleQuantityChange={handleQuantityChange}
          />
        }
      >
        <div class="flex flex-1 items-baseline">
          <button
            aria-label="Decrease Quantity"
            type="button"
            class="flex-1 bg-brand-red sm:rounded-bl-sm text-white p-2"
            onClick={() => {
              void handleQuantityChange(productId, getQuantity() - 1);
            }}
          >
            {getQuantity() === 1 ? "x" : "-"}
          </button>
          <p class="flex-1 flex items-center justify-center px-2">
            x{getQuantity()}
          </p>
          <button
            aria-label="Increase Quantity"
            type="button"
            class="flex-1 bg-brand-red text-white p-2 sm:rounded-br-sm hover:bg-blue-700"
            onClick={() => {
              void handleQuantityChange(productId, getQuantity() + 1);
            }}
          >
            +
          </button>
        </div>
      </Show>
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
      data-testid="add-to-cart"
      type="button"
      class="flex-1 bg-brand-red text-white p-2 sm:rounded-b-sm"
      onClick={() => {
        void handleQuantityChange(productId, 1);
      }}
    >
      Add
    </button>
  );
};

export { AddToCartButton };
