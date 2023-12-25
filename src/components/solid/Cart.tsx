import type { Cart as CartType } from "swell-js";
import { onMount, createSignal, createEffect, type Component, Show } from 'solid-js'
import { formatDate } from '@composables/timeUtils'
import { getDeliverySlots, type Basket } from '@composables/basketUtils'

interface CartProps {
  readonly zipCodes: string[]
}

const Cart: Component<CartProps> = ({ zipCodes }) => {
  const [zipCode, setZipCode] = createSignal<string>('')
  const [isValidZip, setIsValidZip] = createSignal<boolean | null>(null)
  const [deliverySlots, setDeliverySlots] = createSignal<string[]>([])
  const [selectedSlot, setSelectedSlot] = createSignal<string>('')
  const [baskets, setBaskets] = createSignal<Basket[]>([])
  const [activeBasket, setActiveBasket] = createSignal<Basket | null>(null)
  // const [activeBasketIndex, setActiveBasketIndex] = createSignal<number>(0);

  const addNewBasket = (): void => {
    setActiveBasket({ items: [], deliveryDate: selectedSlot() })
    setBaskets([...baskets(), { items: [], deliveryDate: selectedSlot() }])
  }

  createEffect(() => {
    setDeliverySlots(getDeliverySlots())
  })

  const validateZipCode = (): void => {
    const isValid: boolean = zipCodes.includes(zipCode())
    setIsValidZip(isValid)
    if (isValidZip()) {
      localStorage.setItem('gp_zip', zipCode())
      document.cookie = `gp_zip=${zipCode()};max-age=31536000;path=/` // Expires in 1 year
    }
  }

  onMount(() => {
    const savedZipCode = localStorage.getItem('gp_zip')

    if (savedZipCode) {
      setZipCode(savedZipCode)
      setIsValidZip(true)
    }
  })

  const handleSubmit = (e: Event): void => {
    e.preventDefault()
    validateZipCode()

    if (!isValidZip()) {
      window.location.href = '/waitlist'
    }
  }

  return (
    <>
      <div
        data-testid="basket-sidebar"
        id="sidebar-mini"
        data-hs-overlay-keyboard="true"
        class="relative md:absolute md:w-1/2 lg:w-1/3 min-h-[calc(100vh_-_108px)] [--overlay-backdrop:null] hs-overlay hs-overlay-open:translate-x-0 translate-x-full  top-0 end-0 transition-all duration-300 transform h-full lg:max-w-sm z-[60] bg-white border-s dark:bg-gray-800 dark:border-gray-700 hidden"
        tabindex="-1"
      >
        <nav
          class="relative z-0 flex border overflow-hidden dark:border-gray-700"
          aria-label="Tabs"
          role="tablist"
        >
          <Show
            when={!isValidZip()}
            fallback={
              <button
                data-testid="basket-tab-orders"
                type="button"
                class="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-slate-100 first:border-s-0 border-s border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-2xl font-serif text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-400"
                id="bar-with-underline-item-3"
                data-hs-tab="#bar-with-underline-3"
                aria-controls="bar-with-underline-3"
                role="tab"
              >
                <Show when={selectedSlot() === ''} fallback={selectedSlot()}>
                  Select Date
                </Show>
              </button>
            }
          >
            <button
              data-testid="basket-tab-zip"
              type="button"
              class="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-s-0 border-s border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-2xl font-serif text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-400 active"
              id="bar-with-underline-item-1"
              data-hs-tab="#bar-with-underline-1"
              aria-controls="bar-with-underline-1"
              role="tab"
            >
              Enter Zip
            </button>
          </Show>

          <button
            type="button"
            class="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-slate-100 first:border-s-0 border-s border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-2xl font-serif text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-400"
            id="bar-with-underline-item-2"
            data-hs-tab="#bar-with-underline-2"
            aria-controls="bar-with-underline-2"
            role="tab"
          >
            Orders
          </button>
        </nav>

        <Show
          when={!isValidZip()}
          fallback={
            <div
              id="bar-with-underline-3"
              class="h-full flex flex-col bg-white"
              role="tabpanel"
              aria-labelledby="bar-with-underline-item-3"
            >
              <Show
                when={activeBasket() === null}
                fallback={
                  <>
                    <h4 class="text-3xl">Add items to your basket.</h4>
                    <button
                      onClick={() => { addNewBasket() }}
                      data-testid="btn-create-order"
                      type="submit"
                      class="w-3/4 uppercase mt-4 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Start Shopping
                    </button>
                  </>
                }
              >
                <ul class="max-h-[70vh] overflow-y-auto">
                  {deliverySlots().map((slot: string) => (
                    <>
                      <li
                        onClick={() =>
                          setSelectedSlot(
                            formatDate(slot, 'en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })
                          )
                        }
                        class="px-3 py-4 cursor-pointer border-gray-300 border-b flex items-center justify-between"
                      >
                        <div class="">
                          <h4 class="text-2xl font-bold">{slot}</h4>
                          <span>Delivery time: 10:00AM</span>
                        </div>
                        {selectedSlot() ===
                          formatDate(slot, 'en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
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
                  onClick={() => { addNewBasket() }}
                  data-testid="btn-create-order"
                  type="submit"
                  class="w-3/4 uppercase mt-2 mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  Create order
                </button>
              </Show>
            </div>
          }
        >
          <div
            id="bar-with-underline-1"
            role="tabpanel"
            aria-labelledby="bar-with-underline-item-1"
            class=" h-full"
          >
            <form
              class="p-4 flex flex-col h-full gap-y-10"
              onSubmit={handleSubmit}
            >
              <p class="text-gray-500 dark:text-gray-400">
                Before we add items to your order, let's{' '}
                <em class="font-semibold text-gray-800 dark:text-gray-200">
                  confirm
                </em>{' '}
                we deliver to your area.
              </p>
              <div class="flex flex-col gap-y-3">
                <input
                  type="number"
                  class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="Zip Code"
                  id="zip"
                  name="zip"
                  value={zipCode()}
                  onInput={(e) => setZipCode(e.target.value)}
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
              </div>
              <button
                data-testid="btn-verify-zip"
                type="submit"
                class="w-3/4 uppercase mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Check
              </button>
            </form>
          </div>
        </Show>

        {/* <div
          id="bar-with-underline-2"
          class="hidden"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-2"
        ></div> */}
        {/* </div> */}
      </div>
    </>
  )
}

export default Cart
