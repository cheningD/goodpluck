import { Motion, Presence } from "@motionone/solid";

import { Show } from "solid-js";
import { isCartOpen } from "../../store.js";
import { useStore } from "@nanostores/solid";

interface CartProps {
  readonly postcode: string | undefined;
}

export default function Cart({ postcode }: CartProps) {
  const $isCartOpen = useStore(isCartOpen);
  return (
    <Presence exitBeforeEnter>
      <Show when={$isCartOpen()}>
        <Motion.aside
          // class="absolute top-[80px] right-0 bg-blue-100 w-full md:w-[472px] overflow-y-auto"
          // style="height: calc(100vh - 80px)"
          class="fixed top-[80px] md:top-[120px] bottom-0 right-0 bg-gray-100 w-full md:w-[472px] overflow-y-auto"
          animate={{
            x: 0,
          }}
          initial={{
            x: 472,
          }}
          exit={{
            x: 472,
          }}
          transition={{
            duration: 0.5,
            easing: "ease-in-out",
          }}
        >
          {/* Content of the cart sidebar */}
          <div class="p-4">
            {/* State A: ZIP Code Form (example) */}
            <Show when={true}>
              <form>
                <label for="zip">Enter ZIP Code:</label>
                <input type="text" id="zip" name="zip" value={postcode} />
                <input type="submit" value="Submit" />
              </form>
            </Show>
            {/* State B: Cart Items (example placeholder) */}
            <Show when={false}>
              <div>Cart Items Here</div>
              <div class="mt-4">Subtotal: $XX.XX</div>
              <div class="mt-4">Progress Bar Here</div>
            </Show>
          </div>
        </Motion.aside>
      </Show>
    </Presence>
  );
}
