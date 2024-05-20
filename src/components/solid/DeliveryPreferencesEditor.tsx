import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import {
  $subscription,
  $subscriptionResp,
  $updateSwellSubscription,
} from "src/lib/store";

export const DeliveryPreferencesEditor: Component = () => {
  const subscription = useStore($subscription);
  const { mutate } = useStore($updateSwellSubscription)();
  const [isEditing, setIsEditing] = createSignal(false);
  const [error, setError] = createSignal("");
  const [newPreferences, setNewPreferences] = createSignal("");

  const getDeliveryPreferences = (): string =>
    subscription()?.delivery_preferences ?? "";

  const handleEditClick = (): void => {
    setNewPreferences(getDeliveryPreferences());
    setIsEditing(true);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    editDeliveryPreferences().catch((err) => {
      setError(err.message);
    });
    setIsEditing(false);
  };

  const editDeliveryPreferences = async (): Promise<void> => {
    const sub = subscription();
    if (!sub?.id) return;

    if (getDeliveryPreferences() === newPreferences()) {
      return;
    }

    const response = (await mutate({
      id: sub.id,
      interval_count: sub.interval_count,
      billing_schedule: { interval_count: sub.interval_count },
      delivery_preferences: newPreferences(),
    })) as Response;

    if (response.ok) {
      $subscriptionResp.revalidate();
    } else {
      const err = await response.json();
      throw new Error(err.message ?? "Failed to update delivery preferences");
    }
  };

  return (
    <div class="delivery-preferences">
      <p class="text-lg">Delivery Preferences</p>
      {error() && <div class="text-rose-500">{error()}</div>}
      <div class="flex items-center">
        <Show
          when={isEditing()}
          fallback={
            <>
              <p class="text-sm">{getDeliveryPreferences()}</p>
              <button
                type="button"
                onClick={handleEditClick}
                class="text-brand-green ml-2 text-sm"
              >
                Edit
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} class="flex items-center">
            <input
              type="text"
              value={newPreferences()}
              onInput={(e) => setNewPreferences(e.currentTarget.value)}
              class="input-class"
            />
            <button type="submit" class="text-brand-green ml-2 text-sm">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              class="text-red-500 ml-2 text-sm"
            >
              Cancel
            </button>
          </form>
        </Show>
      </div>
    </div>
  );
};
