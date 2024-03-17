import { Show, createEffect, createSignal, type Component } from "solid-js";
import Spinner from "./Spinner";
import {
  $cart,
  $createSwellPaymentInfo,
  $currentCartID,
  $swellAccountId,
} from "@src/lib/store";
import { useStore } from "@nanostores/solid";
import { swell as swellClient } from "@src/lib/swell/client";

export const PaymentInfoForm: Component = () => {
  const cart = useStore($cart);
  const swellAccountId = useStore($swellAccountId);
  const [form, setForm] = createSignal({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    sameAddress: true,
  });
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<
    Record<string, string | null | undefined>
  >({});
  const createSwellPaymentInfoMutation = useStore($createSwellPaymentInfo)();
  const { mutate: createSwellPaymentInfo } = createSwellPaymentInfoMutation;
  const getMutatorErrors = (): any => createSwellPaymentInfoMutation.error;

  const getCheckoutId = (): string | undefined => cart()?.checkout_id;
  const getSwellAccountId = (): string | null => swellAccountId();
  const getCartId = (): string | undefined => cart()?.id;
  const [showAddressForm, setShowAddressForm] = createSignal(false);

  const createStripeCardElement = async (): Promise<void> => {
    await swellClient.cart.recover(getCheckoutId() as string);
    await swellClient.payment.createElements({
      card: {
        elementId: "card-element",
        options: {
          style: { base: { fontSize: "16px" } },
          hidePostalCode: true,
        },
        onReady: () => {
          // const submitButton = document.querySelector(
          //   "#submit-btn",
          // ) as HTMLButtonElement;
          // if (submitButton) {
          //   submitButton.disabled = false;
          // }
        },
      },
    });
  };

  const validateForm = (): void => {
    const { sameAddress, apartment, ...requiredFields } = form();
    if (!sameAddress && Object.values(requiredFields).some((value) => !value)) {
      throw new Error("Please fill out all required fields.");
    }
  };

  createEffect(async () => {
    $currentCartID.set("");
    const checkoutId = getCheckoutId();
    if (checkoutId) {
      await createStripeCardElement();
    }
  });

  const submitForm = async (): Promise<void> => {
    setLoading(true);
    validateForm();

    // Tokenize payment
    await swellClient.payment.tokenize({
      card: {
        onError: async (err: Error) => {
          console.error(err);
          setLoading(false);
        },
      },
    });

    const token = (await swellClient.cart.get())?.billing?.card?.token;

    if (token) {
      await createSwellPaymentInfo({
        ...form(),
        token,
        accountId: getSwellAccountId(),
        cartId: getCartId(),
      });

      if (getMutatorErrors()) throw new Error(getMutatorErrors().message);

      window.location.assign("/?message=Onboarding%20complete!");
    } else {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: "There was an error processing your payment.",
      }));
    }
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: err.message,
      }));
    });
  };

  return (
    <>
      {errors().general && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {errors().general}
        </div>
      )}
      <form id="payment-info-form" method="post" onSubmit={handleSubmit}>
        <fieldset aria-describedby="billing-info-desc">
          <legend class="sr-only">Payment Information</legend>
          <p
            id="error-msg"
            hidden
            class="mb-6 text-sm font-medium text-rose-600 bg-red-50 p-4 rounded border border-rose-500"
          ></p>
          <div id="billing-address-section" class="mb-8">
            <legend class="text-xl font-semibold mb-2">Billing Address</legend>
            <p
              id="billing-info-desc"
              class="text-lg font-semibold mb-4 sr-only"
            >
              Enter your billing information below.
            </p>
            <div id="same-address-container" class="flex mb-6">
              <input
                id="same-address-checkbox"
                class="text-green-700 focus:ring-green-800 border border-zinc-400 rounded mt-0.5 cursor-pointer"
                type="checkbox"
                name="same-address"
                checked={form().sameAddress}
                aria-checked="true"
                aria-describedby="same-as-delivery-desc"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    sameAddress: !prev.sameAddress,
                  }));
                  setShowAddressForm(!showAddressForm());
                }}
              />
              <label
                for="same-address-checkbox"
                class="ml-2 text-sm text-gray-600"
              >
                Same as delivery address
              </label>
              <span id="same-as-delivery-desc" class="sr-only">
                Check this box if your billing address is the same as your
                delivery address.
              </span>
            </div>

            <Show when={showAddressForm()}>
              <div
                id="billing-container"
                hidden={!showAddressForm()}
                aria-labelledby="billing-address-title"
              >
                <h3 id="billing-address-title" class="sr-only">
                  Billing Address Details
                </h3>
                <div
                  id="billing-name-container"
                  class="flex flex-col md:flex-row md:gap-4"
                >
                  <div id="first-name-container" class="mb-6 flex-1">
                    <label
                      for="first-name"
                      class="block text-base font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="first-name"
                      class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                      type="text"
                      value={form().firstName}
                      aria-describedby="first-name-desc"
                      placeholder="Kale"
                    />
                    <span id="first-name-desc" class="sr-only">
                      Please enter your first name.
                    </span>
                  </div>
                  <div id="last-name-container" class="mb-6 flex-1">
                    <label
                      for="last-name"
                      class="block text-base font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      name="last-name"
                      class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                      type="text"
                      value={form().lastName}
                      aria-describedby="last-name-desc"
                      placeholder="Greens"
                    />
                    <span id="last-name-desc" class="sr-only">
                      Please enter your last name.
                    </span>
                  </div>
                </div>
                <div id="billing-address-container">
                  <div id="street-address-container" class="mb-6">
                    <label
                      for="address"
                      class="block text-base font-medium text-gray-700 mb-1"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      // autocomplete="address-line1"
                      value={form().address}
                      class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                      aria-describedby="address-description"
                    />
                    <span id="address-description" class="sr-only">
                      Please enter your full street address here.
                    </span>
                  </div>
                  <div id="apartment-container" class="mb-6">
                    <label
                      for="apartment"
                      class="block text-base font-medium text-gray-700 mb-1"
                    >
                      Apt. or Unit No.{" "}
                      <em class="italic text-sm text-gray-500">Optional</em>
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={form().apartment}
                      autocomplete="address-line2"
                      class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                      aria-describedby="apartment-description"
                    />
                    <span id="apartment-description" class="sr-only">
                      Optional: Please enter your apartment or unit number for
                      precise address details.
                    </span>
                  </div>
                  <div id="city-container" class="mb-6">
                    <label
                      for="city"
                      class="block text-base font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form().city}
                      autocomplete="address-level2"
                      class="peer mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                      aria-describedby="city-description"
                    />
                    <span id="city-description" class="sr-only">
                      Please enter your city name.
                    </span>
                  </div>
                  <div
                    id="state-zip-container"
                    class="flex flex-col md:flex-row md:gap-4"
                  >
                    <div id="state-container" class="flex-1 mb-6">
                      <label
                        for="state"
                        class="block text-base font-medium text-gray-700 mb-1"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={form().state}
                        autocomplete="address-level1"
                        class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                        aria-describedby="state-description"
                      />
                      <span id="state-description" class="sr-only">
                        Please enter your state name.
                      </span>
                    </div>

                    <div id="zip-container" class="flex-1 mb-6">
                      <label
                        for="zip"
                        class="block text-base font-medium text-gray-700 mb-1"
                      >
                        ZIP code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={form().zip}
                        autocomplete="postal-code"
                        class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                        aria-describedby="zip-description"
                      />
                      <span id="zip-description" class="sr-only">
                        Please enter your ZIP code.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          <div
            id="payment-info-section"
            class="mb-8"
            aria-describedby="payment-info-desc"
          >
            <legend class="text-xl font-semibold mb-2">Payment Info</legend>
            <p id="payment-info-desc" class="sr-only">
              Enter your payment details below, including card number,
              expiration date, and CVC.
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
        </fieldset>

        <div class="flex justify-end" id="submit-btn-container">
          <button
            id="submit-btn"
            type="submit"
            class="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none disabled:cursor-wait disabled:bg-green-700"
            aria-describedby="submit-btn-desc"
            disabled={loading() ?? false}
          >
            {loading() ? <Spinner /> : "Submit"}
          </button>
          <span id="submit-btn-desc" class="sr-only">
            Click to submit your details and complete the account creation
            process.
          </span>
        </div>
      </form>
    </>
  );
};
