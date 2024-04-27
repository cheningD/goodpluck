import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import { $swellAccount } from "src/lib/store";
import { BillingCardDisplay } from "./BillingCardDisplay";
import { BillingCardEditor } from "./BillingCardEditor";

export const BillingInfoCard: Component = () => {
  const [editing, setEditing] = createSignal(false);
  const account = useStore($swellAccount);
  const billingCard = account()?.billing?.card;

  return (
    <div class="billing-card-container border border-brand-green p-4 m-4">
      <h3 class="text-lg">Card Details</h3>
      <Show when={billingCard} fallback={<p>No card found.</p>}>
        <Show when={editing()} fallback={<BillingCardDisplay />}>
          <BillingCardEditor setEditing={setEditing} />
        </Show>
        <button class="text-brand-green" onClick={() => setEditing(!editing())}>
          {editing() ? "Cancel" : "Edit Card"}
        </button>
      </Show>
    </div>
  );
};
