import { useStore } from "@nanostores/solid";
import { type Component } from "solid-js";
import {
  For,
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
import { getDeliverySlots } from "@composables/basketUtils";
import {
  isBasketUpdated,
  isCartOpen,
  lastBasketItemAdded,
  lastBasketItemRemoved,
  setIsBasketUpdated,
  setLastBasketItemRemoved,
  swellCartDeliveryDate,
} from "@src/store";
import { isZipCodeDeliverable } from "@utils/validations";
import type { GoodpluckCart } from "@src/lib/types";
import type { Product } from "swell-js";
interface CartProps {
  basket: GoodpluckCart | null;
}

const CartFlyout: Component<CartProps> = ({ basket }) => {
  const [activeBasket, setActiveBasket] = createSignal<GoodpluckCart | null>(
    basket,
    { equals: false },
  );
  const [activeBasketProducts, setActiveBasketProducts] = createSignal<
    Product[]
  >([], { equals: false });
  const $isCartOpen = useStore(isCartOpen);
  const [deliverySlots, setDeliverySlots] = createSignal<Date[]>([]);
  const [zipRequired, setZipRequired] = createSignal<boolean>(false);
  const [zip, setZip] = createSignal<string | undefined>("");
  setZip(
    activeBasket()?.shipping?.zip === undefined
      ? ""
      : activeBasket()?.shipping?.zip,
  );
  const [hasValidZip, setHasValidZip] = createSignal<boolean>(false);
  setHasValidZip(zip() !== "");
  const [deliveryDate, setDeliveryDate] = createSignal<Date | undefined>(
    basket?.delivery_date,
  );

  const [tab, setTab] = createSignal(0);
  const [pending, start] = useTransition();
  const updateTab = (index: number) => (): void => {
    void start(() => setTab(index));
  };
  const [selectQuantity, setSelectedQuantity] = createSignal<number>(1);

  const basketId = basket?.id === undefined ? "" : basket?.id?.toString();

  createEffect(async () => {
    console.log("items changed", isBasketUpdated());
    if (isBasketUpdated()) {
      let newProducts = activeBasketProducts();
      if (lastBasketItemAdded() !== null) {
        newProducts.push(lastBasketItemAdded() as Product);
      }
      if (lastBasketItemRemoved() !== null) {
        newProducts = newProducts.filter(
          (item) => item.id !== lastBasketItemRemoved().id,
        );
      }
      setActiveBasketProducts(newProducts);
      setIsBasketUpdated(false);
    }
  });

  const createOrder = async (): Promise<void> => {
    if (deliveryDate() === null) {
      alert("No delivery date selected!");
    }

    try {
      const response = await fetch("/api/swell", {
        method: "POST",
        body: JSON.stringify({
          method: "DELIVERYDATE",
          cartId: basketId,
          deliveryDate: deliveryDate(),
        }),
      });

      if (response.ok) {
        const cartDeliveryDateUpdated: GoodpluckCart | null = activeBasket();
        if (cartDeliveryDateUpdated !== null) {
          cartDeliveryDateUpdated.delivery_date = deliveryDate();
          console.log("New delivery Date:", cartDeliveryDateUpdated);
          setActiveBasket(cartDeliveryDateUpdated);
          console.log("setActiveBasket:", activeBasket());
        }
        swellCartDeliveryDate.set(deliveryDate()?.toISOString());
        console.log("Order created successfully:");
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  const fetchProducts = async (): Promise<void> => {
    if (activeBasket()?.items) {
      const promises = activeBasket().items.map(async (item) => {
        const params = {
          method: "ITEM",
          itemId: item.product_id ?? "",
        };
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`/api/swell?${queryString}`, {
          method: "GET",
        });

        if (response.ok) {
          const product: Product = await response.json();
          console.log("products: fetchProducts", product.data);
          return product.data;
        } else {
          console.error("Error fetching product:", response.status);
          return null; // or handle the error in a way that makes sense for your app
        }
      });

      const products = await Promise.all(promises);

      setActiveBasketProducts((previousItems: Product[]) => [
        ...previousItems,
        ...(products.filter((product) => product !== null) as Product[]),
      ]);
    }
  };

  createEffect(() => {
    setDeliverySlots(getDeliverySlots());
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    swellCartDeliveryDate.set(String(activeBasket()?.delivery_date));
    await fetchProducts();
    setDeliverySlots(getDeliverySlots());
  });

  const completeOrder = (e: Event): void => {
    e.preventDefault();
    window.location.href = "/join";
  };

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();
    if (zip() === "") {
      setZipRequired(true);
      return;
    }

    if (!isZipCodeDeliverable(zip())) {
      window.location.href = "/waitlist";
      return;
    }
    try {
      const response = await fetch("/api/swell", {
        method: "POST",
        body: JSON.stringify({
          method: "ZIP",
          cartId: basketId,
          zip: zip(),
        }),
      });

      if (response.ok) {
        setHasValidZip(true);
        console.log("setHasValidZip successfully:");
        // return data;
      } else {
        // If not successful, handle the error
        // console.error("Error fetching data:", response.status, data);
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
    // alert(`Update Swell Cart zip ${zip()}`);
  };

  async function deleteFromCart(
    event: MouseEvent,
    product: Product,
  ): Promise<void> {
    event.preventDefault();
    try {
      const response = await fetch("/api/swell", {
        method: "POST",
        body: JSON.stringify({
          method: "DELETEITEM",
          itemId: product.id,
        }),
      });

      if (response.ok) {
        setLastBasketItemRemoved(product);
        setIsBasketUpdated(true);
        console.log("Item removed from Cart successfully:");
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  }

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
                when={hasValidZip()}
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
                  data-testid="active-order"
                  type="button"
                  class="bg-slate-300 w-full"
                  role="tab"
                >
                  {/* Select Date : {formatDate(activeBasket()?.delivery_date)} */}
                  <Show
                    when={activeBasket()?.delivery_date === undefined}
                    fallback={
                      <h4>{formatDate(activeBasket()?.delivery_date)}</h4>
                    }
                  >
                    Select Date
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
                      when={!hasValidZip()}
                      fallback={
                        <Show
                          when={activeBasket()?.delivery_date === undefined}
                          fallback={
                            <>
                              {/* <h4 class="max-h-[70vh] min-h-[70vh] text-3xl text-center">
                                Add items to your basket.
                              </h4> */}
                              <Show when={!!activeBasket()}>
                                <ul
                                  data-testid="product-items"
                                  class="flex flex-col gap-y-1 py-1"
                                >
                                  {activeBasketProducts().map(
                                    (product: Product) => (
                                      <li class="grid grid-cols-4 gap-y-2 gap-x-1 px-1">
                                        <img
                                          alt={`Image of ${product?.name}`}
                                          src={product?.images[0]?.file?.url}
                                          width="65"
                                          height="50"
                                          loading="lazy"
                                          decoding="async"
                                        />
                                        <span class="col-span-2 font-semibold">
                                          {product?.name}
                                        </span>
                                        <div class="flex flex-col">
                                          <span class="font-semibold">
                                            ${product?.cost}
                                          </span>
                                          <select
                                            value={selectQuantity()}
                                            onInput={(e) =>
                                              setSelectedQuantity(
                                                parseInt(e.target.value),
                                              )
                                            }
                                          >
                                            <For
                                              each={[...Array(20)].map(
                                                (_, index) => index + 1,
                                              )}
                                            >
                                              {(quantity) => (
                                                <option value={quantity}>
                                                  {quantity}
                                                </option>
                                              )}
                                            </For>
                                          </select>
                                          <button
                                            onClick={(e) => {
                                              void deleteFromCart(e, product);
                                            }}
                                            class="text-green-700 underline"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </Show>

                              {/* <Show when={activeBasket()}>
                                <ul
                                  data-testid="product-items"
                                  class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-center"
                                >
                                  {activeBasket()?.items.map(
                                    (product: CartItemSnake) => {
                                      return (
                                        <li class="flex flex-col gap-y-2">
                                          <div class="relative rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-52">
                                            <a
                                              href={`/product/${product.slug}`}
                                            >
                                              <Show
                                                when={
                                                  product.images !== undefined
                                                }
                                              >
                                                <img
                                                  alt={`Image of ${product.name}`}
                                                  src={
                                                    product.images[0]?.file?.url
                                                  }
                                                  width="305"
                                                  height="205"
                                                  loading="lazy"
                                                  decoding="async"
                                                  class="absolute w-full h-full rounded-xl"
                                                />
                                              </Show>
                                              <button
                                                onClick={(e) => {
                                                  void addToCart(e, product.id);
                                                }}
                                                aria-label="Add to Cart"
                                                type="button"
                                                class="absolute bottom-2 right-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-gray-900 text-white bg-gray-800 shadow-sm hover:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                              >
                                                + Quick add
                                              </button>
                                            </a>
                                          </div>
                                          <a
                                            class="text-xl font-serif"
                                            href={`/product/${product.slug}`}
                                          >
                                            <span class="hidden">
                                              Product Name:
                                            </span>
                                            {product.name}
                                          </a>
                                          <div class="flex justify-between items-center">
                                            <span class="text-xs text-gray-600">
                                              {product.kind}
                                            </span>
                                            <span class="text-right font-semibold">
                                              ${product.price}
                                            </span>
                                          </div>
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              </Show> */}

                              <button
                                onClick={completeOrder}
                                data-testid="btn-create-order"
                                type="button"
                                class="w-3/4 uppercase mt-4 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              >
                                <Show
                                  when={activeBasketProducts().length > 0}
                                  fallback={"Start Shopping"}
                                >
                                  Complete order
                                </Show>
                              </button>
                            </>
                          }
                        >
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {deliverySlots().map((slot: Date) => (
                              <>
                                <li
                                  onClick={() => {
                                    setDeliveryDate(slot);
                                  }}
                                  class="px-3 py-4 cursor-pointer border-gray-300 border-b flex items-center justify-between"
                                >
                                  <div class="">
                                    <h4 class="text-2xl font-bold">
                                      {formatDate(slot)}
                                    </h4>
                                    <span>Delivery time: 10:00AM</span>
                                  </div>
                                  {deliveryDate() === slot && (
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
                              void createOrder();
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
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
                            value={zip()}
                            onInput={(e) => {
                              setZip(e.target.value);
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
                          onClick={() => handleSubmit}
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
                      when={activeBasket()?.delivery_date !== null}
                      fallback={
                        <>
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {deliverySlots().map((slot: Date) => (
                              <>
                                <li
                                  onClick={() => {
                                    setDeliveryDate(slot);
                                  }}
                                  class="px-3 py-4 cursor-pointer border-gray-300 border-b flex items-center justify-between"
                                >
                                  <div class="">
                                    <h4 class="text-2xl font-bold">
                                      {formatDate(slot)}
                                    </h4>
                                    <span>Delivery time: 10:00AM</span>
                                  </div>
                                  {/* {currentBasket().selectedSlot ===
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
                                  )} */}
                                </li>
                              </>
                            ))}
                          </ul>

                          {/* onClick={() => {
                              void createOrder();
                            }} */}
                          <button
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
                        {/* {(currentBasket().orders.length > 0) &
                        (
                          <ul class="max-h-[70vh] min-h-[70vh] overflow-y-auto">
                            {currentBasket().orders.map((basket: Basket) => (
                              <>
                                <li
                                  onClick={() => {
                                    updateSelectedSlot();
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
                                    {basket.delivery_date} (No items)
                                  </h4>
                                  <span>Delivery time: 10:00AM</span>
                                </li>
                              </>
                            ))}
                          </ul>
                        )} */}

                        <button
                          data-testid="btn-add-order2"
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
