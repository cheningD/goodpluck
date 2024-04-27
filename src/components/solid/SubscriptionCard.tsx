import { Show, type Component } from "solid-js";
import { DeliveryDateSelector } from "./DeliveryDateSelector";
import { DeliveryFrequencySelector } from "./DeliveryFrequencySelector";
import { DeliveryPreferencesEditor } from "./DeliveryPreferencesEditor";
import { useStore } from "@nanostores/solid";
import { $subscription } from "src/lib/store";

export const SubscriptionCard: Component = () => {
  const subscription = useStore($subscription);

  return (
    <div class="subscription-card-container border border-brand-green p-4 m-4">
      <div class="flex items-center">
        <p class="text-lg">Subscription</p>
      </div>

      <Show when={subscription()?.id} fallback={<p>No subscription found.</p>}>
        <button class="text-brand-green text-sm">Skip upcoming basket</button>
        <DeliveryDateSelector />
        <DeliveryFrequencySelector />
        <DeliveryPreferencesEditor />
      </Show>
    </div>
  );
};
