import { Show, createSignal, type Component } from "solid-js";
import Spinner from "./Spinner";
import { $createSwellAccountCard, $swellAccountId } from "src/lib/store";
import { useStore } from "@nanostores/solid";
import { swell as swellClient } from "src/lib/swell/client";
import { TextInput } from "./TextInput";
import { StripeCardElement } from "./StripeCardElement";
import { AddressSection } from "./AddressSection";

export const PaymentInfoForm: Component = () => {
  const accountId = useStore($swellAccountId);
  const accountCardMutation = useStore($createSwellAccountCard)();
  const { mutate: createAccountCard } = accountCardMutation;

  const [form, setForm] = createSignal({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });
  const [errors, setErrors] = createSignal<
    Record<string, string | null | undefined>
  >({});
  const [loading, setLoading] = createSignal(true);
  const [showAddressForm, setShowAddressForm] = createSignal(false);

  const setFieldError = (field: string, message: string | null): void => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const getAccountId = (): string => accountId() as string;
  const getMutationErrors = (): any => accountCardMutation.error;

  const validateForm = (): void => {
    const { apartment, ...requiredFields } = form();
    if (
      showAddressForm() &&
      Object.values(requiredFields).some((value) => !value)
    ) {
      throw new Error("Please fill out all required fields.");
    }
    setErrors({});
  };

  const submitForm = async (): Promise<void> => {
    setLoading(true);
    validateForm();
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
      await createAccountCard({
        parent_id: getAccountId(), // Swell account ID
        token,
        billing: {
          address1: form().address,
          address2: form().apartment,
          city: form().city,
          state: form().state,
          zip: form().zip,
        },
      });

      if (getMutationErrors()) throw new Error(getMutationErrors().message);

      window.location.assign("/market/produce-vegetables");
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

  const handleInputChange = (fieldName: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [fieldName]: value }));
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
                checked={!showAddressForm()}
                aria-checked="true"
                aria-describedby="same-as-delivery-desc"
                onClick={() => {
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
                aria-labelledby="billing-address-title"
              >
                <h3 id="billing-address-title" class="sr-only">
                  Billing Address Details
                </h3>
                <div
                  id="name-container"
                  class="flex md:gap-4 flex-col md:flex-row"
                >
                  <TextInput
                    name="firstName"
                    type="text"
                    label="First Name"
                    value={form().firstName}
                    autocomplete="given-name"
                    placeholder="Kale"
                    onChange={handleInputChange("firstName")}
                    onBlur={() => {
                      if (!form().firstName) {
                        setFieldError("firstName", " "); // Forces only the border to turn red without showing an error message
                      }
                    }}
                    onFocus={() =>
                      setErrors((prev) => ({ ...prev, firstName: null }))
                    }
                    error={errors().firstName}
                  />
                  <TextInput
                    name="lastName"
                    type="text"
                    label="Last Name"
                    value={form().lastName}
                    autocomplete="family-name"
                    placeholder="Greens"
                    onChange={handleInputChange("lastName")}
                    onBlur={() => {
                      if (!form().lastName) {
                        setFieldError("lastName", " "); // Forces only the border to turn red without showing an error message
                      }
                    }}
                    onFocus={() =>
                      setErrors((prev) => ({ ...prev, lastName: null }))
                    }
                    error={errors().lastName}
                  />
                </div>
                <AddressSection
                  form={[form]}
                  errors={[errors, setErrors]}
                  setFieldError={setFieldError}
                  handleInputChange={handleInputChange}
                />
              </div>
            </Show>
          </div>

          <StripeCardElement onReady={() => setLoading(false)} />
        </fieldset>

        <div class="flex justify-end" id="submit-btn-container">
          <button
            id="submit-btn"
            type="submit"
            class="px-6 py-4 my-6 w-full bg-brand-yellow border-2 border-black text-center rounded shadow-md hover:bg-yellow-400"
            aria-describedby="submit-btn-desc"
            disabled={loading() ?? false}
          >
            {loading() ? <Spinner /> : "Join Goodpluck"}
          </button>
          <span id="submit-btn-desc" class="sr-only">
            Click to submit your details and complete the account creation
            process.
          </span>
        </div>
        <p class="my-4 text-gray-700">
          By clicking "Join Goodpluck" you agree to our{" "}
          <a href="/terms" target="#" class="underline hover:shadow-md ">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="#" class="underline hover:shadow-md ">
            Privacy Policy
          </a>
          .
        </p>
        <p class="my-4 text-gray-700">
          Each week, you can edit or skip your basket during the shopping
          period. Your card will be charged on Fridays, and we'll send your
          order to our farms.
        </p>
      </form>
    </>
  );
};
