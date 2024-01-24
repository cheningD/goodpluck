import { useStore } from "@nanostores/solid";
import { isCartOpen } from "../../store";
import type { Component } from "solid-js";

/* If no zip is found, prompt user for zip, else show delivery date */

interface BannerProps {
  isZipDeliverable: boolean;
  deliveryDate: string;
}
const Banner: Component<BannerProps> = ({ isZipDeliverable, deliveryDate }) => {
  const $isCartOpen = useStore(isCartOpen);

  return (
    <div class="bg-brand-green text-white text-sm p-2">
      <span>
        {isZipDeliverable
          ? deliveryDate
            ? `Shopping for ${deliveryDate}`
            : `Choose a delivery date`
          : "Free Delivery to Detroit & Nearby."}
        <button
          class="underline hover:no-underline hover:cursor-pointer px-2"
          data-hs-overlay-backdrop-container="#sidebar-page"
          data-hs-overlay="#sidebar-mini"
          aria-controls="sidebar-mini"
          aria-label="Toggle navigation"
          onClick={() => {
            isCartOpen.set(!$isCartOpen());
            console.log(`Why no open ${$isCartOpen()}`);
          }}
        >
          {isZipDeliverable ? "Edit" : "Check your zip"}
        </button>
      </span>
    </div>
  );
};

export default Banner;
