import { useStore } from "@nanostores/solid";
import type { Component } from "solid-js";
import { $cart, $updateCart } from "src/lib/store";
import {
  calculateNewDeliveryDate,
  getDayOfWeek,
} from "src/lib/swell/cart/dates";

export const SubscriptionManagementCard: Component = () => {
  return (
    <div class="subscription-management">
      <h2>Subscription Management</h2>
      <DeliveryDateSelector />
      <DeliveryFrequencySelector />
    </div>
  );
};

const DeliveryDateSelector: Component = () => {
  const { mutate: updateDeliveryDate, loading: deliveryDateUpdating } =
    useStore($updateCart)();
  const cart = useStore($cart);

  const getDeliveryDay = (): string => {
    const date = cart()?.delivery_date;
    return date ? getDayOfWeek(date) : "";
  };
  const getOtherDeliveryDay = (): string => {
    return getDeliveryDay() === "Sunday" ? "Monday" : "Sunday";
  };
  const handleDeliveryDateChange = async (): Promise<void> => {
    const { id, delivery_date: date } = cart() ?? {};
    if (id && date) {
      await updateDeliveryDate({
        id,
        delivery_date: calculateNewDeliveryDate(date),
      });
    }
  };

  return (
    <>
      {getDeliveryDay() && (
        <div class="delivery-date">
          Delivery Date: <strong>{getDeliveryDay()}</strong>{" "}
          <button
            class="text-brand-green"
            onClick={() => {
              void handleDeliveryDateChange();
            }}
            disabled={deliveryDateUpdating ?? false}
          >
            Switch to {getOtherDeliveryDay()} delivery
          </button>
        </div>
      )}
    </>
  );
};

const DeliveryFrequencySelector: Component = () => {
  return <div class="delivery-frequency">Frequency: </div>;
};
