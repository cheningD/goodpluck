import { useStore } from "@nanostores/solid";
import { isCartOpen } from "../../store";
import { type Component } from "solid-js";
import { EditIcon } from "./Icons";
import { formatDate } from "@composables/timeUtils";

interface BannerProps {
  isZipDeliverable: boolean;
  deliveryDate: Date | null;
}

const Banner: Component<BannerProps> = ({ isZipDeliverable, deliveryDate }) => {
  const $isCartOpen = useStore(isCartOpen);

  const displayMessage = (): string => {
    if (!isZipDeliverable) {
      return "Free Delivery to Detroit & Nearby.";
    }
    return deliveryDate
      ? `Shopping for ${formatDate(deliveryDate)}`
      : `Choose a delivery date`;
  };

  const handleButtonClick = (): void => {
    isCartOpen.set(!$isCartOpen());
  };

  return (
    <div
      data-testid="top-banner"
      class="flex items-center bg-brand-green text-white text-sm p-2"
    >
      <span>{displayMessage()}</span>
      <button
        data-testid="top-banner-zip"
        class="flex items-center underline hover:font-semibold hover:cursor-pointer px-2 gap-2"
        data-hs-overlay-backdrop-container="#sidebar-page"
        data-hs-overlay="#sidebar-mini"
        aria-controls="sidebar-mini"
        aria-label="Toggle navigation"
        onClick={handleButtonClick}
      >
        {isZipDeliverable ? "Edit" : "Check your zip"}
        {EditIcon}
      </button>
    </div>
  );
};

export default Banner;
