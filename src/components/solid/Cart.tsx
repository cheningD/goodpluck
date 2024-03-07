import { useStore } from "@nanostores/solid";
import { $cart } from "@src/lib/store";
import type { CartItemSnake } from "node_modules/swell-js/types/cart/snake";
import { For, Show, type Component } from "solid-js";
import CartItem from "./CartItem";
import DeliveryProgressBar from "./DeliveryProgressBar";

interface GoodpluckCartItem extends CartItemSnake {
  images: Array<{ file: { url: string } }>;
  vendor_name: string;
  unit: string;
  unit_quantity: string;
}

const Cart: Component = () => {
  const cart = useStore($cart);
  const freeDeliveryThreshold = 30; // $30
  const subTotal = cart()?.sub_total;
  const creditApplied = cart()?.account_credit_amount ?? 0;
  const deliveryFee = cart()?.shipment_total ?? 0;
  const totalTax = cart()?.tax_total;
  const total = cart()?.grand_total;
  return (
    <>
      {cart()?.delivery_date ? (
        <div class="bg-brand-green text-white">
          Shopping for {cart()?.delivery_date}
        </div>
      ) : null}
      <Show when={cart()?.items?.length} fallback={<EmptyCart />}>
        <For each={cart()?.items}>
          {(item) => {
            const i = item as GoodpluckCartItem;
            if (i.price === undefined || !i.quantity || !i.product_name) {
              return <p>{`Failed to render item: ${JSON.stringify(i)}`}</p>;
            }
            return (
              <CartItem
                imgsrc={i.images?.[0]?.file?.url ?? null}
                productName={i.product_name}
                vendorName={i.vendor_name}
                quantity={i.quantity}
                unit={i.unit}
                unitQuantity={i.unit_quantity}
                priceDollars={i.price}
              />
            );
          }}
        </For>

        {subTotal !== undefined && subTotal < freeDeliveryThreshold ? (
          <DeliveryProgressBar
            subTotal={subTotal}
            freeDeliveryThreshold={freeDeliveryThreshold}
          />
        ) : null}

        {subTotal !== undefined ? (
          <div class="flex">
            <span class="flex-1 font-semibold text-gray-600">Subtotal</span>
            <span>${subTotal}</span>
          </div>
        ) : null}
        <div class="flex">
          <span class="flex-1 font-semibold text-gray-600">Delivery</span>
          {subTotal !== undefined ? (
            <span>{deliveryFee !== 0 ? `$${deliveryFee}` : "Free"}</span>
          ) : null}
        </div>
        {creditApplied ? (
          <div class="flex">
            <span class="flex-1 font-semibold text-gray-600">Credits</span>
            <span class="text-brand-green">-${creditApplied}</span>
          </div>
        ) : null}
        {totalTax ? (
          <div class="flex">
            <span class="flex-1 font-semibold text-gray-600">Tax</span>

            <span>${totalTax}</span>
          </div>
        ) : null}

        {total !== undefined ? (
          <div class="flex py-4">
            <span class="flex-1 font-semibold">Total</span>
            <span>${total}</span>
          </div>
        ) : null}

        <p>
          <button class="bg-brand-yellow p-4 rounded-md my-4">
            Complete Order
          </button>
        </p>
        <p>
          {cart()?.delivery_date
            ? `Complete your order by ${cart()?.delivery_date} or your basket will be refreshed when we update the market.`
            : "Complete your order to get your delivery!"}
        </p>
        <p class="py-2">
          Already have an account?{" "}
          <a class="text-brand-green underline" href="/login">
            Login here
          </a>
        </p>
      </Show>
    </>
  );
};

export default Cart;

const EmptyCart: Component = () => {
  return <p>Add items to your basket!</p>;
};
