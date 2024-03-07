import { type Component } from "solid-js";

interface ProgressBarProps {
  subTotal: number;
  freeDeliveryThreshold: number;
}

const DeliveryProgressBar: Component<ProgressBarProps> = ({
  subTotal,
  freeDeliveryThreshold,
}) => {
  const remaining = freeDeliveryThreshold - subTotal;
  const remainingDollars = remaining;

  const progressPercentage = ((subTotal / freeDeliveryThreshold) * 100).toFixed(
    0,
  );

  return (
    <div class="mt-2 mb-8">
      <div class="text-gray-800 mb-2">
        ${remainingDollars} away from free delivery!
      </div>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div
          class="bg-green-500 h-4 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DeliveryProgressBar;
