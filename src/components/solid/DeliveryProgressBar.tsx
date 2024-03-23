import { useStore } from "@nanostores/solid";
import { $cart } from "src/lib/store";
import { type Component } from "solid-js";

const DeliveryProgressBar: Component = () => {
  const cart = useStore($cart);
  const freeDeliveryThreshold = 30.0; // $30
  const getRemainingDollars = (): number =>
    (freeDeliveryThreshold * 100 - (cart()?.sub_total ?? 0) * 100) / 100;

  const getProgressPercentage = (): string =>
    Math.min(
      100,
      ((cart()?.sub_total ?? 0) / freeDeliveryThreshold) * 100,
    ).toFixed(0);

  return (
    <div class="mt-2 mb-8">
      <div class="text-brand-green mb-2">
        {getRemainingDollars() > 0
          ? `Add $${getRemainingDollars()} for free delivery`
          : `You're getting free delivery`}
      </div>
      {getRemainingDollars() > 0 && (
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="bg-brand-green h-4 rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DeliveryProgressBar;
