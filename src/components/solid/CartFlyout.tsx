import { Show, type Component } from "solid-js";
import { $isCartOpen } from "../../store";
import { useStore } from "@nanostores/solid";
import { Motion, Presence } from "solid-motionone";

const CartFlyout: Component = () => {
  const isCartOpen = useStore($isCartOpen);

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
              I am the cart flyout
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
