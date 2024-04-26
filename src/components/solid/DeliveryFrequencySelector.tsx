import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import { $subscription, $updateSwellSubscription } from "src/lib/store";

export const DeliveryFrequencySelector: Component = () => {
  const [error, setError] = createSignal("");
  const { mutate: updateDeliveryFrequency, loading: isUpdating } = useStore(
    $updateSwellSubscription,
  )();
  const subscription = useStore($subscription);

  const toggleFrequency = async (): Promise<void> => {
    const sub = subscription();
    if (!sub?.id) {
      setError("Subscription ID missing.");
      return;
    }

    // Interval count is the number of weeks between deliveries.
    // Goodpluck only supports weekly (1) and bi-weekly (2) deliveries.
    const newIntervalCount = sub.interval_count === 1 ? 2 : 1;

    const response = (await updateDeliveryFrequency({
      id: sub.id,
      interval_count: newIntervalCount,
      billing_schedule: { interval_count: newIntervalCount },
    })) as Response;

    if (!response.ok) {
      const errorMessage =
        (await response.json()).message ||
        "Failed to update delivery frequency.";
      setError(errorMessage);
    }
  };

  const frequencyLabel = (): string =>
    subscription()?.interval_count === 1 ? "Weekly" : "Bi-weekly";
  const nextFrequencyLabel = (): string =>
    subscription()?.interval_count === 1 ? "Bi-weekly" : "Weekly";

  return (
    <Show when={subscription()} fallback={<div>No subscription found</div>}>
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
