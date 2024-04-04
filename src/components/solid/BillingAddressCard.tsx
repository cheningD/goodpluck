import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, Show, type Component } from "solid-js";
import { $swellAccount, $updateSwellAccountCard } from "src/lib/store";

import Spinner from "./Spinner";
import { TextInput } from "./TextInput";
import type { Account } from "swell-js";
type Billing = Account["billing"] | undefined;

export const BillingAddressCard: Component = () => {
  const [editing, setEditing] = createSignal(false);
  const account = useStore($swellAccount);

  const isLoading = (): boolean => account() === undefined;
  const getBilling = (): Account["billing"] | undefined => account()?.billing;

  return (
    <div class="billing-address-container border border-brand-green p-4 m-4">
      <Show
        when={isLoading()}
        fallback={
          <Show
            when={getBilling()}
            fallback={
              <p>
                You have no card on file. Add one{" "}
                <a class="text-brand-green" href="/join/payment-info">
                  here
                </a>
                .
              </p>
            }
          >
            <Show when={editing()} fallback={<BillingAddressDisplay />}>
              <BillingAddressEditor setEditing={setEditing} />
            </Show>
            <button
              class="text-brand-green"
              onClick={() => setEditing(!editing())}
            >
              {editing() ? "Cancel" : "Edit Address"}
            </button>
          </Show>
        }
      >
        <Spinner />
      </Show>
    </div>
  );
};

const BillingAddressEditor: Component<{
  setEditing: (value: boolean) => void;
}> = (props) => {
  // Signals
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<
    Record<string, string | null | undefined>
  >({});
  const [form, setForm] = createSignal<Record<string, string>>({});

  // Store and mutations
  const account = useStore($swellAccount);
  const accountCardMutation = useStore($updateSwellAccountCard)();
  const { mutate: updateAccountCard } = accountCardMutation;

  // Form fields
  const formFields = [
    { name: "address1", label: "Street Address" },
    { name: "address2", label: "Apt. or Unit No." },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "zip", label: "ZIP Code" },
  ];

  // Helper functions
  const getBillingCardId = (): string =>
    account()?.billing?.account_card_id ?? "";

  const getMutationErrors = (): any => accountCardMutation.error;

  const isFormDataSameAsBilling = (): boolean => {
    const billing = account()?.billing;
    return Object.entries(form()).every(
      ([key, value]) => value === billing?.[key as keyof typeof billing],
    );
  };

  // Handlers
  const handleInputChange = (fieldName: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [fieldName]: value.toString() }));
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    setLoading(true);
    submitForm().catch((err) => {
      props.setEditing(false);
      setErrors((prev) => ({
        ...prev,
        general: getMutationErrors()?.message ?? err.message,
      }));
    });
  };

  const submitForm = async (): Promise<void> => {
    await updateAccountCard({
      id: getBillingCardId(),
      billing: {
        ...form(),
      },
    });
    if (getMutationErrors()) throw new Error(getMutationErrors().message);
    window.location.reload();
  };

  // Initialization
  createEffect(() => {
    setForm(
      formFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] =
          account()?.billing?.[field.name as keyof Billing] ?? "";
        return acc;
      }, {}),
    );
  });

  return (
    <>
      {errors().general && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {errors().general}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h3 class="text-lg">Billing Address</h3>
        <div id="billing-address-section" class="mb-4">
          {formFields.map((field) => (
            <TextInput
              name={field.name}
              type="text"
              label={field.label}
              value={form()[field.name]}
              onChange={handleInputChange(field.name)}
              error={
                field.name !== "address2" ? errors()[field.name] : undefined
              }
            />
          ))}
        </div>
        <button type="submit" disabled={isFormDataSameAsBilling() || loading()}>
          {loading() ? <Spinner /> : "Save Address"}
        </button>
      </form>
    </>
  );
};

const BillingAddressDisplay: Component = () => {
  const account = useStore($swellAccount);
  const getBilling = (): Account["billing"] | undefined => account()?.billing;
  const getBillingAddress = (): string | undefined => getBilling()?.address1;
  const getBillingApt = (): string | undefined => getBilling()?.address2;
  const getBillingCity = (): string | undefined => getBilling()?.city;
  const getBillingState = (): string | undefined => getBilling()?.state;
  const getBillingZip = (): string | undefined => getBilling()?.zip;

  return (
    <>
      <h3 class="text-lg">Billing Address</h3>
      <div class="billing-address">
        <div class="address1">
          <label for="address1">Street Address: </label>
          {getBillingAddress()}
        </div>
        <div class="address2">
          <label for="address2">Apt. or Unit No: </label>
          {getBillingApt()}
        </div>
        <div class="city">
          <label for="city">City: </label>
          {getBillingCity()}
        </div>
        <div class="state">
          <label for="state">State: </label>
          {getBillingState()}
        </div>
        <div class="zip">
          <label for="zip">Zip: </label>
          {getBillingZip()}
        </div>
      </div>
    </>
  );
};
