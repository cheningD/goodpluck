import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import { $updateCart, $cart } from "src/lib/store";
import {
  getDayOfWeek,
  getNextDeliveryDateOption,
} from "src/lib/swell/cart/dates";

export const DeliveryDateSelector: Component = () => {
  const [error, setError] = createSignal("");
  const { mutate: updateDeliveryDate, loading: isUpdating } =
    useStore($updateCart)();
  const cart = useStore($cart);

  const currentDeliveryDay = (): string => {
    const date = cart()?.delivery_date;
    return date ? getDayOfWeek(date) : "";
  };

  // Returns the alternate delivery day based on the current delivery day (Options: Sunday, Monday)
  const alternateDeliveryDay = (): string =>
    currentDeliveryDay() === "Sunday" ? "Monday" : "Sunday";

  const changeDeliveryDate = async (): Promise<void> => {
    const cartDetails = cart();
    const nextDeliveryDate = getNextDeliveryDateOption(
      cartDetails?.delivery_date ?? "",
    );

    if (cartDetails?.id && nextDeliveryDate) {
      const resp = (await updateDeliveryDate({
        id: cartDetails.id,
        delivery_date: nextDeliveryDate,
      })) as Response;

      if (!resp.ok) {
        const err = await resp.json();
        setError(err.message ?? "Failed to update delivery date");
      }
    }
  };

  return (
    <Show
      when={currentDeliveryDay()}
      fallback={
        <div class="delivery-date">
          Delivery Date: <strong>Not set</strong>
        </div>
      }
    >
      {error() && <div class="text-rose-500">{error()}</div>}
      <div class="delivery-date">
        Delivery Date: <strong>{currentDeliveryDay()} morning</strong>{" "}
        <button
          class="text-brand-green"
          onClick={() => {
            void changeDeliveryDate();
          }}
          disabled={isUpdating ?? false}
        >
          Switch to {alternateDeliveryDay()} delivery
        </button>
      </div>
    </Show>
  );
};
