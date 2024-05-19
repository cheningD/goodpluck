import { type Component } from "solid-js";
import { DeliveryDateSelector } from "./DeliveryDateSelector";
import { DeliveryFrequencySelector } from "./DeliveryFrequencySelector";
import { DeliveryPreferencesEditor } from "./DeliveryPreferencesEditor";

export const SubscriptionCard: Component = () => {
  return (
    <div class="subscription-card-container border border-brand-green p-4 m-4">
      <div class="flex items-center">
        <p class="text-lg">Subscription</p>
        <button class="text-brand-green ml-2 text-sm">
          Skip upcoming basket
        </button>
      </div>

      <DeliveryDateSelector />
      <DeliveryFrequencySelector />
      <DeliveryPreferencesEditor />
    </div>
  );
};
