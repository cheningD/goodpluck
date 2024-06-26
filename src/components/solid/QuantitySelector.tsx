import { useStore } from "@nanostores/solid";
import { $cart, $updateCartItems } from "src/lib/store";
import {
  editItemQuantityCart,
  removeItemFromCart,
} from "src/lib/swell/cart/item";

import { type Component } from "solid-js";

interface QuantitySelectorProps {
  quantity: number;
  productId: string;
}

const QuantitySelector: Component<QuantitySelectorProps> = ({
  quantity,
  productId,
}) => {
  const { mutate } = useStore($updateCartItems)();
  const cart = useStore($cart);
  const handleQuantityChange = async (quantity: number): Promise<void> => {
    const cartdata = cart();
    if (!cartdata) {
      throw new Error("Cart not found");
    }
    if (quantity === 0) {
      await removeItemFromCart(productId, cartdata, mutate);
    } else {
      await editItemQuantityCart(productId, quantity, cartdata, mutate);
    }
  };

  const options = [];
  for (let i = 1; i <= 10; i++) {
    options.push(
      <option value={i} selected={quantity === i}>
        {i}
      </option>,
    );
  }

  return (
    <>
      <select
        class="rounded-md h-9"
        value={quantity}
        onChange={(event) => {
          void handleQuantityChange(parseInt(event.target.value));
        }}
      >
        {options}
      </select>
      <button
        class="text-sm text-brand-green"
        onClick={() => {
          void handleQuantityChange(0);
        }}
      >
        Remove
      </button>
    </>
  );
};

export default QuantitySelector;
