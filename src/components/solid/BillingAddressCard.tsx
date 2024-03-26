import { createSignal, Show, type Component } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $swellAccount } from "src/lib/store";
import type { Account } from "swell-js";

export const BillingAddressCard: Component = () => {
  const account = useStore($swellAccount);
  const getBilling = (): Account["billing"] | undefined => account()?.billing;
  const [editing, setEditing] = createSignal(false);

  return (
    <>
      <Show
        when={getBilling()}
        fallback={
          <div class="payment-info">
            <p>You have no billing address saved.</p>
          </div>
        }
      >
        <div class="billing-address-container border border-brand-green p-4 m-4">
          <Show when={editing()} fallback={<BillingAddressDisplay />}>
            <BillingAddressEditor setEditing={setEditing} />
          </Show>
          <button
            class="text-brand-green"
            onClick={() => setEditing(!editing())}
          >
            {editing() ? "Cancel" : "Edit Address"}
          </button>
        </div>
      </Show>
    </>
  );
};

const BillingAddressEditor: Component<{
  setEditing: (value: boolean) => void;
}> = (props) => {
  const account = useStore($swellAccount);

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    console.log("Updating billing address...");
    props.setEditing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 class="text-lg">Billing Address</h3>
      <div class="billing-address">
        <div class="address1">
          <label for="address1">Address1: </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={account()?.billing?.address1 ?? ""}
          />
        </div>
        <div class="address2">
          <label for="address2">Address2: </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={account()?.billing?.address2 ?? ""}
          />
        </div>
        <div class="city">
          <label for="city">City: </label>
          <input
            type="text"
            id="city"
            name="city"
            value={account()?.billing?.city ?? ""}
          />
        </div>
        <div class="state">
          <label for="state">State: </label>
          <input
            type="text"
            id="state"
            name="state"
            value={account()?.billing?.state ?? ""}
          />
        </div>
        <div class="zip">
          <label for="zip">Zip: </label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={account()?.billing?.zip ?? ""}
          />
        </div>
      </div>
      <button type="submit">Save Address</button>
    </form>
  );
};

const BillingAddressDisplay: Component = () => {
  const account = useStore($swellAccount);

  return (
    <>
      <h3 class="text-lg">Billing Address</h3>
      <div class="billing-address">
        <div class="address1">
          <label for="address1">Street Address: </label>
          {account()?.billing?.address1}
        </div>
        <div class="address2">
          <label for="address2">Apt. or Unit No: </label>
          {account()?.billing?.address2}
        </div>
        <div class="city">
          <label for="city">City: </label>
          {account()?.billing?.city}
        </div>
        <div class="state">
          <label for="state">State: </label>
          {account()?.billing?.state}
        </div>
        <div class="zip">
          <label for="zip">Zip: </label>
          {account()?.billing?.zip}
        </div>
      </div>
    </>
  );
};
