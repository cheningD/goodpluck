import { useStore } from "@nanostores/solid";
import { type Component } from "solid-js";
import { $swellAccount } from "src/lib/store";

export const BillingCardDisplay: Component = () => {
  const account = useStore($swellAccount);
  const getBillingCardNumber = (): string | undefined =>
    account()?.billing?.card?.last4;
  const getBillingCardExpiry = (): string | undefined =>
    account()?.billing?.card?.exp_month +
    "/" +
    account()?.billing?.card?.exp_year;

  return (
    <>
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
