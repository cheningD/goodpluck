import { useStore } from "@nanostores/solid";
import { type Component } from "solid-js";
import { $swellAccount } from "src/lib/store";
import type { Account } from "swell-js";

export const BillingAddressDisplay: Component = () => {
  const account = useStore($swellAccount);
  const getBilling = (): Account["billing"] | undefined => account()?.billing;
  const getBillingAddress = (): string | undefined => getBilling()?.address1;
  const getBillingApt = (): string | undefined => getBilling()?.address2;
  const getBillingCity = (): string | undefined => getBilling()?.city;
  const getBillingState = (): string | undefined => getBilling()?.state;
  const getBillingZip = (): string | undefined => getBilling()?.zip;

  return (
    <>
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
