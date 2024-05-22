import { useStore } from "@nanostores/solid";
import { $cart } from "src/lib/store";
import { For, Show, type Component } from "solid-js";
import CartItem from "./CartItem";
import DeliveryProgressBar from "./DeliveryProgressBar";
import { format } from "date-fns";

const Cart: Component = () => {
  const cart = useStore($cart);
  const getBilling = (): any => cart()?.billing ?? null;
  const getAccountId = (): string => cart()?.account_id ?? "";
  const getSubTotal = (): number => cart()?.sub_total ?? 0;
  const getCreditApplied = (): number => cart()?.account_credit_amount ?? 0;
  const getDeliveryFee = (): number => cart()?.shipment_total ?? 0;
  const getTotalTax = (): number => cart()?.tax_total ?? 0;
  const getTotal = (): number => cart()?.grand_total ?? 0;
  const getDate = (): string => cart()?.delivery_date ?? "";
  return (
    <>
      {getDate() ? (
        <div class="bg-brand-green text-white px-4 py-2">
          Shopping for {format(getDate(), "EEE, MMM d")}
        </div>
      ) : null}
      <div class="px-4 py-4">
        <Show when={cart()?.items?.length} fallback={<EmptyCart />}>
          <DeliveryProgressBar />
          <For each={cart()?.items}>{(item) => <CartItem {...item} />}</For>

          <div class="flex pt-6 text-gray-600">
            <span class="flex-1">Subtotal</span>
            <span class="font-light">${getSubTotal()}</span>
          </div>

          <div class="flex text-gray-600">
            <span class="flex-1">Delivery</span>
            <span>
              {getDeliveryFee() !== 0 ? `$${getDeliveryFee()}` : "Free"}
            </span>
          </div>

          {getCreditApplied() && (
            <div class="flex text-gray-600">
              <span class="flex-1">Credits</span>
              <span class="text-brand-green">-${getCreditApplied()}</span>
            </div>
          )}

          {getTotalTax() && (
            <div class="flex text-gray-600">
              <span class="flex-1">Tax</span>
              <span>${getTotalTax()}</span>
            </div>
          )}

          <div class="flex py-4">
            <span class="flex-1 font-semibold">Total Due</span>
            <span>${getTotal()}</span>
          </div>

          <Show
            when={getAccountId() && Object.keys(getBilling()).length !== 0}
            fallback={
              <p class="my-8">
                <a
                  class="p-4 mt-8 bg-brand-yellow border-2 border-black text-center font-MEDIUM rounded shadow-md hover:bg-yellow-400 focus:shadow-md focus:top-[1px] focus:left-[1px] transition ease-in duration-50"
                  href="/join/personal-info"
                >
                  Complete Order
                </a>
              </p>
            }
          >
            <div class="bg-yellow-50 p-4">
              <strong>No Checkout Required!</strong>
              <div>
                You'll be automatically charged for items in your cart after the
                cutoff time.{" "}
                <a href="#" class="underline text-brand-green">
                  Skip
                </a>{" "}
                or edit by{" "}
                <strong>{format(getDate(), "h:mma EEE, MMM d")}.</strong>
              </div>
            </div>
          </Show>

          <p>
            {getDate()
              ? `Complete your order by ${format(getDate(), "h:mma EEE, MMM d")} or your basket will be refreshed when we update the market.`
              : "Complete your order to get your delivery!"}
          </p>

          <Show when={!cart()?.account_id}>
            <p class="py-8">
              Already have an account?{" "}
              <a class="text-brand-green underline" href="/login">
                Login here
              </a>
            </p>
          </Show>
        </Show>
      </div>
    </>
  );
};

export default Cart;

const EmptyCart: Component = () => {
  return (
    <div class="flex flex-col justify-between py-8">
      <p class="text-center">Add items to your basket</p>
      <a
        href="/market/produce"
        class="py-4 mt-16 bg-brand-yellow border-2 border-black text-center font-bold rounded shadow-md hover:bg-yellow-400 focus:shadow-md focus:top-[1px] focus:left-[1px] transition ease-in duration-50"
      >
        Shop the market
      </a>
    </div>
  );
};
