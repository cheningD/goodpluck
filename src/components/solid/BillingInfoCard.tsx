import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import { $swellAccount, $createSwellAccountCard } from "src/lib/store";
import type { Card } from "swell-js";
import { StripeCardElement } from "./StripeCardElement";
import { swell as swellClient } from "src/lib/swell/client";
import Spinner from "./Spinner";

export const BillingInfoCard: Component = () => {
  const [editing, setEditing] = createSignal(false);
  const account = useStore($swellAccount);
  const isLoading = (): boolean => account() === undefined;
  const getBillingCard = (): Card | undefined => account()?.billing?.card;

  return (
    <div class="billing-card-container border border-brand-green p-4 m-4">
      <Show
        when={isLoading()}
        fallback={
          <Show
            when={getBillingCard()}
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
            <Show when={editing()} fallback={<BillingCardDisplay />}>
              <BillingCardEditor setEditing={setEditing} />
            </Show>
            <button
              class="text-brand-green"
              onClick={() => setEditing(!editing())}
            >
              {editing() ? "Cancel" : "Edit Card"}
            </button>
          </Show>
        }
      >
        <Spinner />
      </Show>
    </div>
  );
};

const BillingCardEditor: Component<{ setEditing: (value: boolean) => void }> = (
  props,
) => {
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
        <h3 class="text-lg">Card Info</h3>
        <StripeCardElement onReady={() => setLoading(false)} />
        <button type="submit" disabled={loading() ?? false}>
          {loading() ? <Spinner /> : "Save Card"}
        </button>
      </form>
    </>
  );
};

const BillingCardDisplay: Component = () => {
  const account = useStore($swellAccount);
  const getBillingCardNumber = (): string | undefined =>
    account()?.billing?.card?.last4;
  const getBillingCardExpiry = (): string | undefined =>
    account()?.billing?.card?.exp_month +
    "/" +
    account()?.billing?.card?.exp_year;

  return (
    <>
      <h3 class="text-lg">Card Info</h3>
      <div class="card-info">
        <div class="card-number">
          <label for="card-number">Card Number: </label>
          Ends with {getBillingCardNumber()}
        </div>
        <div class="card-expiry">
          <label for="card-expiry">Expiry Date: </label>
          {getBillingCardExpiry()}
        </div>
      </div>
    </>
  );
};
