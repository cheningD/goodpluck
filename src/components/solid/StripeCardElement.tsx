import { useStore } from "@nanostores/solid";
import { createEffect, type Component } from "solid-js";
import { $cart } from "src/lib/store";
import { swell as swellClient } from "src/lib/swell/client";
import Spinner from "./Spinner";

export const StripeCardElement: Component<{ onReady: () => void }> = (
  props,
) => {
  const cart = useStore($cart);
  const getCheckoutId = (): string => cart()?.checkout_id as string;
  const createStripeCardElement = async (): Promise<void> => {
    await swellClient.cart.recover(getCheckoutId());
    await swellClient.payment.createElements({
      card: {
        elementId: "card-element",
        options: {
          style: { base: { fontSize: "16px" } },
          hidePostalCode: true,
        },
        onReady: () => {
          props.onReady();
        },
      },
    });
  };

  createEffect(async () => {
    const checkoutId = getCheckoutId();
    if (checkoutId) {
      await createStripeCardElement();
    }
  });

  return (
    <div
      id="payment-info-section"
      class="mb-8"
      aria-describedby="payment-info-desc"
    >
      <legend class="text-xl font-semibold mb-2">Payment Info</legend>
      <p id="payment-info-desc" class="sr-only">
        Enter your payment details below, including card number, expiration
        date, and CVC.
      </p>
      <div
        id="card-details-container"
        class="mb-1 text-base py-4 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
      >
        <div id="card-element" aria-labelledby="card-info">
          <Spinner />
        </div>
        <span id="card-info" class="sr-only">
          Card details input field.
        </span>
      </div>
    </div>
  );
};
