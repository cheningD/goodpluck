import { useStore } from "@nanostores/solid";
import { type Component } from "solid-js";
import {
  createEffect,
  onMount,
  Show,
  createSignal,
  Suspense,
  Switch,
  Match,
  useTransition,
} from "solid-js";
import { formatDate } from "@composables/timeUtils";
import { getDeliverySlots, type Basket } from "@composables/basketUtils";
import {
  basketStore,
  updateIsValidZip,
  updateZip,
  updateOrders,
  updateActiveOrder,
  updateSelectedSlot,
  isCartOpen,
} from "@src/store";

interface CartProps {
  readonly zipCodes: string[];
}

const CartFlyout: Component<CartProps> = ({ zipCodes }) => {
  const $isCartOpen = useStore(isCartOpen);
  const [deliverySlots, setDeliverySlots] = createSignal<string[]>([]);
  const currentBasket = useStore(basketStore);
  const [zipRequired, setZipRequired] = createSignal<boolean>(false);

  const [addBasketFromOrdersTab, setAddBasketFromOrdersTab] =
    createSignal<boolean>(false);

  const [tab, setTab] = createSignal(0);
  const [pending, start] = useTransition();
  const updateTab = (index: number) => (): void => {
    void start(() => setTab(index));
  };

  const addNewBasket = (): void => {
    if (currentBasket().selectedSlot === "") {
      alert("No delivery date selected!");
      return;
    }
    updateActiveOrder({
      items: [],
      deliveryDate: currentBasket().selectedSlot,
    });
    const newOrders = currentBasket().orders;
    newOrders.push({ items: [], deliveryDate: currentBasket().selectedSlot });
    updateOrders(newOrders);
  };

  createEffect(() => {
    setDeliverySlots(getDeliverySlots());
  });

  const validateZipCode = (): void => {
    const isValid: boolean = zipCodes.includes(currentBasket().zip);
    updateIsValidZip(isValid);
    if (currentBasket().isValidZip) {
      document.cookie = `gp_zip=${currentBasket().zip};max-age=31536000;path=/`; // Expires in 1 year
    }
  };
  onMount(() => {
    console.log("currentBasket", currentBasket());
    setDeliverySlots(getDeliverySlots());
  });

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    if (currentBasket().zip === "") {
      setZipRequired(true);
      return;
    }

    validateZipCode();

    if (!currentBasket().isValidZip) {
      window.location.href = "/waitlist";
    }
  };
  // classList={{ hidden: !$isCartOpen() }}

  return (
    <>
      {$isCartOpen() && (
        <div
          data-testid="basket-sidebar"
          class="z-50 fixed right-0 bottom-0 h-[calc(100vh_-_40px)] bg-slate-100 w-1/4"
        >
          <ul class="grid grid-cols-2">
            <li onClick={updateTab(0)}>
              <Show
                when={currentBasket().isValidZip}
                fallback={
                  <button
                    data-testid="basket-tab-zip"
                    type="button"
                    class="bg-slate-300 w-full"
                    role="tab"
                  >
                    Enter Zip
                  </button>
                }
              >
                <button
                  data-testid="basket-tab-orders"
                  type="button"
                  class="bg-slate-300 w-full"
                  role="tab"
                >
                  <Show
                    when={currentBasket().selectedSlot === ""}
                    fallback={currentBasket().selectedSlot}
                  >
                    <h4>Select Date</h4>
                  </Show>
                </button>
              </Show>
            </li>
            <li classList={{ selected: tab() === 1 }} onClick={updateTab(1)}>
              <button
                type="button"
                class="bg-slate-300 w-full"
                data-testid="basket-btn-orders"
                role="tab"
              >
                Orders
              </button>
            </li>
          </ul>
          <div class="h-full" classList={{ pending: pending() }}>
            <Suspense fallback={<div class="loader">Loading...</div>}>
              <Switch>
                <Match when={tab() === 0}>
                  <div class="max-h-[80vh] flex flex-col justify-center">
                    <Show
                      when={!currentBasket().isValidZip}
                      fallback={
                        <Show
                          when={currentBasket().activeOrder === null}
                          fallback={
                            <>
                              <h4 class="max-h-[70vh] min-h-[70vh] text-3xl text-center">
                                Add items to your basket.
                              </h4>
                              <button
                                onClick={() => {
                                  addNewBasket();
                                }}
                                data-testid="btn-create-order"
                                type="button"
                                class="w-3/4 uppercase mt-4 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              >
                                Start Shopping
                              </button>
                            </>
                          }
                        >
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {deliverySlots().map((slot: string) => (
                              <>
                                <li
                                  onClick={() => {
                                    updateSelectedSlot(
                                      formatDate(slot, "en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      }),
                                    );
                                  }}
                                  class="px-3 py-4 cursor-pointer border-gray-300 border-b flex items-center justify-between"
                                >
                                  <div class="">
                                    <h4 class="text-2xl font-bold">{slot}</h4>
                                    <span>Delivery time: 10:00AM</span>
                                  </div>
                                  {currentBasket().selectedSlot ===
                                    formatDate(slot, "en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    }) && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="w-8 h-8 bg-orange-800 text-white rounded-full p-1"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M9 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m8-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-9.8-3.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2H1v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2M18 2.8l-1.4-1.4l-4.8 4.8l-2.6-2.6L7.8 5l4 4z"
                                      />
                                    </svg>
                                  )}
                                </li>
                              </>
                            ))}
                          </ul>

                          <button
                            onClick={() => {
                              addNewBasket();
                            }}
                            data-testid="btn-create-order"
                            type="submit"
                            class="w-3/4 uppercase mt-2 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            Create order
                          </button>
                        </Show>
                      }
                    >
                      <form
                        class="p-4 flex flex-col h-full gap-y-10"
                        onSubmit={handleSubmit}
                      >
                        <p class="text-gray-500 dark:text-gray-400">
                          Before we add items to your order, let's{" "}
                          <em class="font-semibold text-gray-800 dark:text-gray-200">
                            confirm
                          </em>{" "}
                          we deliver to your area.
                        </p>
                        <div class="flex flex-col gap-y-3">
                          <input
                            required
                            type="number"
                            class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                            placeholder="Zip Code"
                            id="zip"
                            name="zip"
                            value={currentBasket().zip}
                            onInput={(e) => {
                              updateZip(e.target.value);
                            }}
                            data-testid="user-zip"
                          />
                          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?
                            <a
                              class="text-blue-600 ml-1 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              href="/login"
                            >
                              Sign In here
                            </a>
                          </p>
                          {zipRequired() && (
                            <span class="text-red-500 font-medium">
                              Error: a zip code number required to continue!
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => validateZipCode}
                          data-testid="btn-verify-zip"
                          type="submit"
                          class="w-3/4 uppercase mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          Check
                        </button>
                      </form>
                    </Show>
                  </div>
                </Match>
                <Match when={tab() === 1}>
                  <div class="flex flex-col content-center">
                    <Show
                      when={!addBasketFromOrdersTab()}
                      fallback={
                        <>
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {deliverySlots().map((slot: string) => (
                              <>
                                <li
                                  onClick={() => {
                                    updateSelectedSlot(
                                      formatDate(slot, "en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      }),
                                    );
                                  }}
                                  class="px-3 py-4 cursor-pointer border-gray-300 border-b flex items-center justify-between"
                                >
                                  <div class="">
                                    <h4 class="text-2xl font-bold">{slot}</h4>
                                    <span>Delivery time: 10:00AM</span>
                                  </div>
                                  {currentBasket().selectedSlot ===
                                    formatDate(slot, "en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    }) && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="w-8 h-8 bg-orange-800 text-white rounded-full p-1"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M9 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m8-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-9.8-3.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2H1v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2M18 2.8l-1.4-1.4l-4.8 4.8l-2.6-2.6L7.8 5l4 4z"
                                      />
                                    </svg>
                                  )}
                                </li>
                              </>
                            ))}
                          </ul>

                          <button
                            onClick={() => {
                              addNewBasket();
                            }}
                            data-testid="btn-create-order"
                            type="submit"
                            class="w-3/4 uppercase mt-2 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            Create order
                          </button>
                        </>
                      }
                    >
                      <>
                        <h3 class="text-3xl font-medium text-center ">
                          No Basket added yet!
                        </h3>
                        {(currentBasket().orders.length > 0) &
                        (
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {currentBasket().orders.map((basket: Basket) => (
                              <>
                                <li
                                  onClick={() => {
                                    updateSelectedSlot(
                                      formatDate(basket.deliveryDate, "en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      }),
                                    );
                                  }}
                                  class="px-3 py-4 cursor-pointer border-gray-300 border-b flex flex-col"
                                >
                                  <span class="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="w-6 h-6 rounded-full p-1 text-white bg-orange-800"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M15 13h1.5v2.82l2.44 1.41l-.75 1.3L15 16.69zm4-5H5v11h4.67c-.43-.91-.67-1.93-.67-3a7 7 0 0 1 7-7c1.07 0 2.09.24 3 .67zM5 21a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h1V1h2v2h8V1h2v2h1a2 2 0 0 1 2 2v6.1c1.24 1.26 2 2.99 2 4.9a7 7 0 0 1-7 7c-1.91 0-3.64-.76-4.9-2zm11-9.85A4.85 4.85 0 0 0 11.15 16c0 2.68 2.17 4.85 4.85 4.85A4.85 4.85 0 0 0 20.85 16c0-2.68-2.17-4.85-4.85-4.85"
                                      />
                                    </svg>
                                    <strong class="text-xl text-orange-800">
                                      Your Next Delivery
                                    </strong>
                                  </span>
                                  <h4 class="text-2xl font-bold">
                                    {basket.deliveryDate} (No items)
                                  </h4>
                                  <span>Delivery time: 10:00AM</span>
                                </li>
                              </>
                            ))}
                          </ul>
                        )}

                        <button
                          onClick={() => setAddBasketFromOrdersTab(true)}
                          data-testid="btn-verify-zip"
                          type="button"
                          class="w-3/4 uppercase mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          Create Order
                        </button>
                      </>
                    </Show>
                  </div>
                </Match>
              </Switch>
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default CartFlyout;
