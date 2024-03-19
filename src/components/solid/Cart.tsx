import { useStore } from "@nanostores/solid";
import { $cart } from "@src/lib/store";
import { For, Show, type Component } from "solid-js";
import CartItem from "./CartItem";
import DeliveryProgressBar from "./DeliveryProgressBar";

const Cart: Component = () => {
  const cart = useStore($cart);
  const getBilling = (): any => cart()?.billing ?? null;
  const getAccountId = (): string => cart()?.account_id ?? "";
  const getSubTotal = (): number => cart()?.sub_total ?? 0;
  const getCreditApplied = (): number => cart()?.account_credit_amount ?? 0;
  const getDeliveryFee = (): number => cart()?.shipment_total ?? 0;
  const getTotalTax = (): number => cart()?.tax_total ?? 0;
  const getTotal = (): number => cart()?.grand_total ?? 0;
  return (
    <>
      {cart()?.delivery_date ? (
        <div class="bg-brand-green text-white">
          Shopping for {cart()?.delivery_date}
        </div>
      ) : null}
      <Show when={cart()?.items?.length} fallback={<EmptyCart />}>
        <DeliveryProgressBar />
        <For each={cart()?.items}>{(item) => <CartItem {...item} />}</For>

        <div class="flex">
          <span class="flex-1 font-semibold text-gray-600">Subtotal</span>
          <span>${getSubTotal()}</span>
        </div>

        <div class="flex">
          <span class="flex-1 font-semibold text-gray-600">Delivery</span>
          <span>
            {getDeliveryFee() !== 0 ? `$${getDeliveryFee()}` : "Free"}
          </span>
        </div>

        {getCreditApplied() && (
          <div class="flex">
            <span class="flex-1 font-semibold text-gray-600">Credits</span>
            <span class="text-brand-green">-${getCreditApplied()}</span>
          </div>
        )}

        {getTotalTax() && (
          <div class="flex">
            <span class="flex-1 font-semibold text-gray-600">Tax</span>
            <span>${getTotalTax()}</span>
          </div>
        )}

        <div class="flex py-4">
          <span class="flex-1 font-semibold">Total</span>
          <span>${getTotal()}</span>
        </div>

        <Show
          when={getAccountId() && Object.keys(getBilling()).length !== 0}
          fallback={
            <p class="my-4">
              <a
                class="bg-brand-yellow p-4 rounded-md"
                href="/join/personal-info"
              >
                Complete Order
              </a>
            </p>
          }
        >
          <p class="my-4">
            <a class="bg-brand-yellow p-4 rounded-md" href="/checkout">
              Checkout
            </a>
          </p>
        </Show>

        <p>
          {cart()?.delivery_date
            ? `Complete your order by ${cart()?.delivery_date} or your basket will be refreshed when we update the market.`
            : "Complete your order to get your delivery!"}
        </p>

        <Show when={!cart()?.account_id}>
          <p class="py-2">
            Already have an account?{" "}
            <a class="text-brand-green underline" href="/login">
              Login here
            </a>
          </p>
        </Show>
      </Show>
    </>
  );
};

export default Cart;

const EmptyCart: Component = () => {
  return <p>Add items to your basket!</p>;
};
