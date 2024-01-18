import { useStore } from "@nanostores/solid";
import { isCartOpen } from "@src/store";
import { type Component } from "solid-js";

const CartFlyoutToggle: Component = () => {
  const $isCartOpen = useStore(isCartOpen);
  return (
    <button
      data-testid="top-banner-zip"
      class="hover:cursor-pointer"
      onClick={() => {
        isCartOpen.set(!$isCartOpen());
      }}
    >
      {$isCartOpen() ? "Delivery Date" : "Please enter your zip"}
    </button>
  );
};

export default CartFlyoutToggle;
