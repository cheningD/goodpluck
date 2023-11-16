import { useStore } from "@nanostores/solid";
import { createSignal, Show, For, type Component } from "solid-js";
import logo from "@assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../../store.js";

const Header: Component = (props) => {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  const $isMenuOpen = useStore(isMenuOpen);
  const [isSearchOpen, setSearchOpen] = createSignal(false);
  const toggleSearch = () => setSearchOpen(!isSearchOpen())
  console.log('log from tSX', props.collections);
  return (
    <>
      {/* <!-- ========== HEADER ========== --> */}
      <header class="w-full max-w-7xl mx-auto  sticky top-0 flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full bg-white text-sm py-3 lg:py-0 dark:bg-gray-800">
        <nav
          class="max-w-[85rem] w-full mx-auto px-4 lg:px-6 xl:px-8"
          aria-label="Global"
        >
          <div class="relative min-h-[68px] lg:flex lg:items-center lg:justify-between">
          <Show when={!isSearchOpen()}>
          <div class="flex items-center justify-between">
              <div class="lg:hidden flex space-x-4 items-center">
                <button
                  type="button"
                  class="hs-collapse-toggle flex justify-center items-center w-9 h-9 text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  data-hs-collapse="#navbar-collapse-with-animation"
                  aria-controls="navbar-collapse-with-animation"
                  aria-label="Toggle navigation"
                >
                  <svg
                    class="hs-collapse-open:hidden flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                  <svg
                    class="hs-collapse-open:block hidden flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
                {/* Search Icon */}
                <IconMdiMagnify class="w-6 h-6" />
              </div>
              {/* Center Column: Logo - This should be dead center */}
              <div class="justify-self-center pb-2 lg:pr-6">
                <img src={logo.src} alt="Goodpluck" class="h-8 w-auto" />
              </div>

              {/* 3rd Column: Login Button / Basket Button */}
              <div class="lg:hidden justify-self-end pr-2 pt-1">
                <a
                  href=""
                  class="text-sm uppercase font-semibold text-orange-800"
                >
                  Login
                </a>
              </div>
            </div>
          </Show>


            <Show when={!isSearchOpen()}
            fallback={
              <div class="py-2 px-4 w-full">
              <input type="text" class="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Search"/>
              </div>
            }
            >
            <div
              id="navbar-collapse-with-animation"
              class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:flex lg:justify-center"
            >

            <div class="flex flex-col gap-x-0 mt-5 divide-y divide-dashed divide-gray-200 lg:flex-row lg:items-center lg:justify-end lg:gap-x-7 lg:mt-0 lg:ps-7 lg:divide-y-0 lg:divide-solid dark:divide-gray-700">

            <For each={props.collections}>{(collection, i) =>
                <a  class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#" >
                    {collection.name}
                  </a>
          }</For>

        
            </div>

              {/* <div class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                <div class="flex flex-col gap-x-0 mt-5 divide-y divide-dashed divide-gray-200 lg:flex-row lg:items-center lg:justify-end lg:gap-x-7 lg:mt-0 lg:ps-7 lg:divide-y-0 lg:divide-solid dark:divide-gray-700">
                  <a
                    class="font-medium text-gray-500  py-3 lg:py-6 dark:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                    aria-current="page"
                  >
                    Farm Boxes
                  </a>

                  <a
                    class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Thanksgiving
                  </a>

                  <div class="hs-dropdown [--strategy:static] lg:[--strategy:absolute] [--adaptive:none] lg:[--trigger:hover] py-3 lg:py-4">
                    <button
                      type="button"
                      class="flex items-center w-full text-gray-500 hover:text-gray-400 font-medium dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Produce
                      <svg
                        class="flex-shrink-0 ms-2 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] lg:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 w-full hidden z-10 top-full start-0 min-w-[15rem] bg-white lg:shadow-2xl rounded-lg py-2 lg:p-4 dark:bg-gray-800 dark:divide-gray-700 before:absolute before:-top-5 before:start-0 before:w-full before:h-5">
                      <div class="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div class="flex flex-col mx-1 lg:mx-0">
                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Peak Season
                          </a>
                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Fruit
                          </a>

                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Vegetable
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Meat & Seafood
                  </a>
                  <a
                    class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Dairy & Eggs
                  </a>
                  <a
                    class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Bakery
                  </a>
                  <div class="hidden lg:block hs-dropdown [--strategy:static] lg:[--strategy:absolute] [--adaptive:none] lg:[--trigger:hover] py-3 lg:py-4">
                    <button
                      type="button"
                      class="flex items-center w-full text-gray-500 hover:text-gray-400 font-medium dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      More
                      <svg
                        class="flex-shrink-0 ms-2 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] lg:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 w-full hidden z-10 top-full start-0 min-w-[15rem] bg-white lg:shadow-2xl rounded-lg py-2 lg:p-4 dark:bg-gray-800 dark:divide-gray-700 before:absolute before:-top-5 before:start-0 before:w-full before:h-5">
                      <div class="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div class="flex flex-col mx-1 lg:mx-0">
                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Peak Season
                          </a>
                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Fruit
                          </a>

                          <a
                            class="group flex gap-x-5 hover:bg-gray-100 rounded-lg p-4 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            href="#"
                          >
                            Vegetable
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    class="lg:hidden font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Easy Meals
                  </a>
                  <a
                    class="lg:hidden font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Drinks
                  </a>
                  <a
                    class="lg:hidden font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Pantry
                  </a>
                  <div class="hidden lg:inline-block h-6 w-0.5 self-stretch my-auto bg-neutral-500 opacity-100"></div>
                  <a
                    class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    New & Seasonal
                  </a>

                  <div class="pt-3 lg:pt-0 flex gap-x-4">
                    <a
                      class="lg:hidden py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-800 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      href="#"
                    >
                      <svg
                        class="flex-shrink-0 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Log in
                    </a>
                    <a
                      class="lg:hidden py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-800 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      href="#"
                    >
                      Join
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
            </Show>


            <div class="hidden lg:flex items-center gap-x-4">
              {/* Search Icon */}
              <IconMdiMagnify onClick={toggleSearch}
               class="w-6 h-6 cursor-pointer" />
              {/* Basket icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm2-6c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm4 6c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z"
                />
              </svg>
            </div>
          </div>
        </nav>
      </header>
      {/* <!-- ========== END HEADER ========== --> */}
    </>
  );
};

export default Header;
