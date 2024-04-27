import { useStore } from "@nanostores/solid";
import { createSignal, Show, type Component } from "solid-js";
import { $swellAccount } from "src/lib/store";
import { BillingAddressEditor } from "./BillingAddressEditor";
import { BillingAddressDisplay } from "./BillingAddressDisplay";

export const BillingAddressCard: Component = () => {
  const [editing, setEditing] = createSignal(false);
  const account = useStore($swellAccount);
  const billing = account()?.billing;

  return (
    <div class="billing-address-container border border-brand-green p-4 m-4">
      <h3 class="text-lg">Billing Address</h3>
      <Show when={billing} fallback={<p>No billing info found.</p>}>
        <Show when={editing()} fallback={<BillingAddressDisplay />}>
          <BillingAddressEditor setEditing={setEditing} />
        </Show>
        <button class="text-brand-green" onClick={() => setEditing(!editing())}>
          {editing() ? "Cancel" : "Edit Address"}
        </button>
      </Show>
    </div>
  );
};
