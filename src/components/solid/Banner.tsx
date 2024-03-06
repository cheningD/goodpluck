import { useStore } from "@nanostores/solid";
import type { Component } from "solid-js";
import { $cart, $isCartOpen } from "../../lib/store";
import { EditIcon } from "./Icons";

const Banner: Component = () => {
  const isCartOpen = useStore($isCartOpen);
  const cart = useStore($cart);

  const displayMessage = (): string => {
    if (!cart()?.shipping?.zip) {
      return "Free Delivery to Detroit & Nearby.";
    }
    return cart()?.date_delivery
      ? `Shopping for ${cart()?.date_delivery}`
      : `Choose a delivery date`;
  };

  const handleButtonClick = (): void => {
    $isCartOpen.set(!isCartOpen());
  };

  return (
    <div class="flex items-center bg-brand-green text-white text-sm p-2">
      <span>{displayMessage()}</span>
      <button
        class="flex items-center underline hover:font-semibold hover:cursor-pointer px-2 gap-2"
        onClick={handleButtonClick}
      >
        {cart()?.shipping?.zip ? "Edit" : "Check your zip"}
        {EditIcon}
      </button>
    </div>
  );
};

export default Banner;
