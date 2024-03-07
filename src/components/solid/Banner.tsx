import { useStore } from "@nanostores/solid";
import type { Component } from "solid-js";
import { $cart, $isCartOpen } from "../../lib/store";
import { EditIcon } from "./Icons";

const Banner: Component = () => {
  const isCartOpen = useStore($isCartOpen);
  const cart = useStore($cart);

  const handleButtonClick = (): void => {
    $isCartOpen.set(!isCartOpen());
  };

  return (
    <div class="flex items-center bg-brand-green text-white text-sm p-2">
      <span>Free Delivery to Detroit & Nearby.</span>
      {cart()?.shipping?.zip ? (
        <button
          class="flex items-center underline hover:font-semibold hover:cursor-pointer px-2 gap-2"
          onClick={handleButtonClick}
        >
          Check your zip
          {EditIcon}
        </button>
      ) : null}
    </div>
  );
};

export default Banner;
