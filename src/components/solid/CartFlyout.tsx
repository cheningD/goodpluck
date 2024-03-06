import { useStore } from "@nanostores/solid";
import { Show, createSignal, type Component } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { $cart, $isCartOpen } from "../../lib/store";
import ZipForm from "./ZipForm";

const CartFlyout: Component = () => {
  const isCartOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const [showZipForm, setShowZipForm] = createSignal(false);

  return (
    <>
      <div class="sticky top-[80px] right-0 z-30">
        <Presence exitBeforeEnter>
          <Show when={isCartOpen()}>
            <Motion
              class="absolute right-0 w-80 p-4 bg-white  h-[calc(100vh-80px)]"
              animate={{ x: [300, 0] }}
              transition={{ duration: 0.2, easing: "ease-in-out" }}
              exit={{ x: 300 }}
            >
              <p>Cart ID {cart()?.id}</p>
              <p>ZIP: {cart()?.shipping?.zip ?? "Not Set"}</p>
              _____
              <Show when={showZipForm() || !cart()?.shipping?.zip}>
                <ZipForm />
              </Show>
              <Show when={cart()?.shipping?.zip && !showZipForm()}>
                {" "}
                <button
                  class="text-brand-green"
                  onClick={() => {
                    setShowZipForm(!showZipForm());
                  }}
                >
                  Update zip
                </button>
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
