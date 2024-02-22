import { useStore } from "@nanostores/solid";
import { $isCartOpen } from "../../store";
import type { Component } from "solid-js";
import { EditIcon } from "./Icons";

interface BannerProps {
  isZipDeliverable: boolean;
  deliveryDate: string | null;
}

const Banner: Component<BannerProps> = ({ isZipDeliverable, deliveryDate }) => {
  const isCartOpen = useStore($isCartOpen);

  const displayMessage = (): string => {
    if (!isZipDeliverable) {
      return "Free Delivery to Detroit & Nearby.";
    }
    return deliveryDate
      ? `Shopping for ${deliveryDate}`
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
        {isZipDeliverable ? "Edit" : "Check your zip"}
        {EditIcon}
      </button>
    </div>
  );
};

export default Banner;
