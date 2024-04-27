import { useStore } from "@nanostores/solid";
import { createSignal, type Component } from "solid-js";
import { $swellAccount, $createSwellAccountCard } from "src/lib/store";
import { StripeCardElement } from "./StripeCardElement";
import { swell as swellClient } from "src/lib/swell/client";
import Spinner from "./Spinner";

export const BillingCardEditor: Component<{
  setEditing: (value: boolean) => void;
}> = (props) => {
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const account = useStore($swellAccount);
  const getAccountId = (): string => account()?.id as string;
  const accountCardMutation = useStore($createSwellAccountCard)();
  const { mutate: createAccountCard } = accountCardMutation;
  const getMutationErrors = (): any => accountCardMutation.error;

  const submitForm = async (): Promise<void> => {
    setLoading(true);
    await swellClient.payment.tokenize({
      card: {
        onError: async () => console.error,
      },
    });

    // Get the token from the cart
    const token = (await swellClient.cart.get())?.billing?.card?.token;
    if (token) {
      await createAccountCard({
        parent_id: getAccountId(), // Swell Account ID
        token,
        billing: {
          address1: account()?.billing?.address1,
          address2: account()?.billing?.address2,
          city: account()?.billing?.city,
          state: account()?.billing?.state,
          zip: account()?.billing?.zip,
        },
      });

      if (getMutationErrors()) throw new Error(getMutationErrors().message);

      // Fields aren't dynamically updated, so we need to refresh the page. Todo: Fix this.
      window.location.reload();
    } else {
      throw new Error("There was an error processing your payment.");
    }
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => {
      props.setEditing(false);
      setError(getMutationErrors()?.message ?? err.message);
    });
  };

  return (
    <>
      {error() && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {error()}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <StripeCardElement onReady={() => setLoading(false)} />
        <button type="submit" disabled={loading() ?? false}>
          {loading() ? <Spinner /> : "Save Card"}
        </button>
      </form>
    </>
  );
};
