import { createSignal, Show, type Component } from "solid-js";
import { DeliveryDateSelector } from "./DeliveryDateSelector";
import { DeliveryFrequencySelector } from "./DeliveryFrequencySelector";
import { DeliveryPreferencesEditor } from "./DeliveryPreferencesEditor";
import { useStore } from "@nanostores/solid";
import {
  $cart,
  $subscription,
  $subscriptionResp,
  $updateSwellSubscription,
} from "src/lib/store";
import { addWeeks, isPast, startOfWeek } from "date-fns";

export const SubscriptionCard: Component = () => {
  const [error, setError] = createSignal<string>("");
  const cart = useStore($cart);
  const subscription = useStore($subscription);
  const { mutate, loading } = useStore($updateSwellSubscription)();

  const calculatePauseEndDate = (intervalCount: number): string =>
    addWeeks(startOfWeek(new Date()), intervalCount).toISOString();

  const toggleSubscriptionStatus = async (): Promise<void> => {
    const { id, interval_count: intervalCount, status } = subscription() ?? {};
    const { ordering_window_end_date: orderingWindowEndDate } = cart() ?? {};

    if (!id) return;

    const windowEnd = new Date(orderingWindowEndDate ?? "");
    if (isPast(windowEnd)) {
      setError(
        "Cannot skip upcoming basket because the ordering window has ended.",
      );
      return;
    }

    const paused = status === "paused";
    const datePauseEnd = paused
      ? null
      : calculatePauseEndDate(intervalCount as number);

    try {
      const response = (await mutate({
        id,
        paused: !paused,
        draft: paused,
        date_pause_end: datePauseEnd,
        interval_count: intervalCount,
        billing_schedule: { interval_count: intervalCount },
      })) as Response;

      if (!response.ok) {
        const err = await response.json();
        setError(
          err.message ||
            (paused
              ? "Failed to skip upcoming basket"
              : "Failed to resume upcoming basket"),
        );
      } else {
        $subscriptionResp.revalidate();
      }
    } catch (err) {
      setError("An error occurred while updating the subscription.");
    }
  };

  return (
    <div class="subscription-card-container border border-brand-green p-4 m-4">
      <div class="flex items-center">
        <p class="text-lg">Subscription</p>
      </div>

      <Show when={subscription()?.id} fallback={<p>No subscription found.</p>}>
        {error() && <div class="text-rose-500">{error()}</div>}
        <button
          class="text-brand-green ml-2 text-sm"
          onclick={() => {
            void toggleSubscriptionStatus();
          }}
          disabled={loading ?? false}
        >
          {subscription()?.status === "paused" ? "Resume" : "Skip"} upcoming
          basket
        </button>{" "}
        <DeliveryDateSelector />
        <DeliveryFrequencySelector />
        <DeliveryPreferencesEditor />
      </Show>
    </div>
  );
};
