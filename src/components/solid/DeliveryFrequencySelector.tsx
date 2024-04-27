import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import {
  $subscription,
  $subscriptionResp,
  $updateSwellSubscription,
} from "src/lib/store";

export const DeliveryFrequencySelector: Component = () => {
  const [error, setError] = createSignal("");
  const { mutate: updateDeliveryFrequency, loading: isUpdating } = useStore(
    $updateSwellSubscription,
  )();
  const subscription = useStore($subscription);

  const toggleFrequency = async (): Promise<void> => {
    // Interval count is the number of weeks between deliveries.
    // Goodpluck only supports weekly (1) and bi-weekly (2) deliveries.
    const { id, interval_count: intervalCount } = subscription() ?? {};

    if (id) {
      const newIntervalCount = intervalCount === 1 ? 2 : 1;
      const response = (await updateDeliveryFrequency({
        id,
        interval_count: newIntervalCount,
        billing_schedule: { interval_count: newIntervalCount },
      })) as Response;

      if (response.ok) {
        // More on caching: https://github.com/nanostores/query?tab=readme-ov-file#how-cache-works
        $subscriptionResp.revalidate();
      } else {
        const err = await response.json();
        setError(err.message ?? "Failed to update delivery frequency");
      }
    }
  };

  const frequencyLabel = (): string =>
    subscription()?.interval_count === 1 ? "Weekly" : "Bi-weekly";
  const nextFrequencyLabel = (): string =>
    subscription()?.interval_count === 1 ? "Bi-weekly" : "Weekly";

  return (
    <Show when={subscription()?.id} fallback={<div>No subscription found</div>}>
      <div>
        {error() && <div class="text-rose-500">{error()}</div>}
        <div>
          Delivery Frequency: <strong>{frequencyLabel()}</strong>{" "}
          <button
            class="text-brand-green"
            onClick={() => {
              void toggleFrequency();
            }}
            disabled={isUpdating ?? false}
          >
            Switch to {nextFrequencyLabel()} delivery
          </button>
        </div>
      </div>
    </Show>
  );
};
