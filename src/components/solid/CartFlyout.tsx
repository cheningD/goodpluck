import { useStore } from "@nanostores/solid";
import { Show, type Component } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { $cart, $isCartOpen, $subscription } from "src/lib/store";
import ZipForm from "./ZipForm";
import Cart from "./Cart";

const CartFlyout: Component = () => {
  const isCartOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const sub = useStore($subscription);
  console.log(sub()); // for testing

  return (
    <>
      <div class="sticky top-[80px] right-0 z-30">
        <Presence exitBeforeEnter>
          <Show when={isCartOpen()}>
            <Motion
              class="absolute right-0 w-[475px] p-4 bg-white  h-[calc(100vh-80px)] overflow-y-scroll"
              animate={{ x: [475, 0] }}
              transition={{ duration: 0.2, easing: "ease-in-out" }}
              exit={{ x: 475 }}
            >
              <Show when={cart()?.shipping?.zip} fallback={<ZipForm />}>
                <Cart />
              </Show>
            </Motion>
          </Show>
        </Presence>
      </div>
      <Show when={isCartOpen()}>
        <Motion
          class="fixed bg-brand-green  h-screen  w-full z-10"
          onClick={() => {
            $isCartOpen.set(false);
          }}
          animate={{ opacity: [0, 0.4] }}
          transition={{ duration: 0.2, easing: "ease-in-out" }}
        />
      </Show>
    </>
  );
};

export default CartFlyout;
