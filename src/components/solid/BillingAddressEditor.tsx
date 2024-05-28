import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, type Component } from "solid-js";
import { $swellAccount, $updateSwellAccountCard } from "src/lib/store";

import Spinner from "./Spinner";
import { AddressSection } from "./AddressSection";

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

  const setFieldError = (field: string, message: string | null): void => {
    setErrors((prev) => ({ ...prev, [field]: message }));
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
        address1: form().address,
        address2: form().apartment,
        city: form().city,
        state: form().state,
        zip: form().zip,
      },
    });
    if (getMutationErrors()) throw new Error(getMutationErrors().message);
    window.location.reload();
  };

  createEffect(() => {
    setForm({
      address: account()?.billing?.address1 ?? "",
      apartment: account()?.billing?.address2 ?? "",
      city: account()?.billing?.city ?? "",
      state: account()?.billing?.state ?? "",
      zip: account()?.billing?.zip ?? "",
    });
  });

  return (
    <>
      {errors().general && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {errors().general}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <AddressSection
          form={[form]}
          errors={[errors, setErrors]}
          setFieldError={setFieldError}
          handleInputChange={handleInputChange}
        />
        <button type="submit" disabled={isFormDataSameAsBilling() || loading()}>
          {loading() ? <Spinner /> : "Save Address"}
        </button>
      </form>
    </>
  );
};
