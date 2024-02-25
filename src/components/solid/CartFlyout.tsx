import { Show, type Component } from "solid-js";
import {
  $isCartOpen,
  $cart,
  $zip,
  $gpSessionToken,
  $stytchAuthResp,
  $guestCartID,
  $guestCart,
} from "../../lib/store";
import { useStore } from "@nanostores/solid";
import { Motion, Presence } from "solid-motionone";
import ZipForm from "./ZipForm";

const CartFlyout: Component = () => {
  const isCartOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const zip = useStore($zip);
  const gpSessionToken = useStore($gpSessionToken);
  const stytchAuthResp = useStore($stytchAuthResp);
  const guestCartID = useStore($guestCartID);
  const guestCart = useStore($guestCart);

  const clearZip = (): void => {
    void fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: cart()?.id, shipping: { zip: null } }),
    });
  };

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
              <p>This is the zip: {zip()}</p>
              <p>
                This is the gpSessionToken: {JSON.stringify(gpSessionToken())}
              </p>
              <p>
                This is the stytchAuthResp: {JSON.stringify(stytchAuthResp())}
              </p>
              <p>This is the guestCartID: {guestCartID()}</p>
              <p>This is the guestCart: {JSON.stringify(guestCart())}</p>

              <p>This is the cartid: {cart()?.id}</p>

              <Show when={!zip()}>
                <ZipForm />
              </Show>
              <button onclick={clearZip}>Change Zip</button>
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
