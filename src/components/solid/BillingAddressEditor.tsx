import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, type Component } from "solid-js";
import { $swellAccount, $updateSwellAccountCard } from "src/lib/store";

import Spinner from "./Spinner";
import { TextInput } from "./TextInput";
import type { Account } from "swell-js";
type Billing = Account["billing"] | undefined;

export const BillingAddressEditor: Component<{
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
