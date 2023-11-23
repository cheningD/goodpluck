import { useStore } from "@nanostores/solid";
import { createSignal, Show, For, type Component } from "solid-js";
import logo from "@assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../../store.js";

interface IProps {
  collections: any;
}

const Header: Component<IProps> = ({ collections }) => {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  const $isMenuOpen = useStore(isMenuOpen);
  const [isSearchOpen, setSearchOpen] = createSignal(false);
  const toggleSearch = () => setSearchOpen(!isSearchOpen());
  console.log("log from tSX", collections);
  const categories = collections.filter((col) => col.parent_id == null);

  function getSubCategories(parentId) {
    console.log("getSubCategories parentId", parentId);

    const categories = collections.filter((col) => col.parent_id == parentId);
    console.log("categories:", categories);

    if (categories) {
      return categories;
    }
    return [];
  }

  return (
    <>
      {/* <!-- ========== HEADER ========== --> */}
      <header class="max-w-7xl mx-auto  sticky top-0 flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full bg-white text-sm py-3 lg:py-0 dark:bg-gray-800">
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

            <Show
              when={!isSearchOpen()}
              fallback={
                <div class="py-2 px-4 w-full">
                  <input
                    type="text"
                    class="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Search"
                  />
                </div>
              }
            >
              <div
                id="navbar-collapse-with-animation"
                class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:flex lg:justify-center"
              >
                <div class="flex flex-col gap-x-0 mt-5 divide-y divide-dashed divide-gray-200 lg:flex-row lg:items-center lg:justify-end lg:gap-x-7 lg:mt-0 lg:ps-7 lg:divide-y-0 lg:divide-solid dark:divide-gray-700">
                  <For each={categories}>
                    {(collection, i) => (
                      <Show
                        when={getSubCategories(collection.id).length == 0}
                        fallback={
                          <div class="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] py-3 md:py-6">
                            <button
                              type="button"
                              class="flex items-center w-full text-gray-800 hover:text-gray-600 font-medium dark:text-gray-200 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            >
                              {collection.name}
                            </button>

                            <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 md:w-80 hidden z-10 bg-white md:shadow-2xl rounded-lg py-2 md:p-2 dark:bg-gray-800 dark:divide-gray-700 before:absolute top-full before:-top-5 before:start-0 before:w-full before:h-5">
                              <For each={getSubCategories(collection.id)}>
                                {(subCollection, i) => (
                                  <a
                                    class="inline-flex gap-x-5 w-full p-4 text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    href="#"
                                  >
                                    {subCollection.name}
                                  </a>
                                )}
                              </For>
                            </div>
                          </div>
                        }
                      >
                        <a
                          class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                        >
                          {collection.name}
                        </a>
                      </Show>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <div class="hidden lg:flex items-center gap-x-4">
              {/* Search Icon */}
              <IconMdiMagnify
                onClick={toggleSearch}
                class="w-6 h-6 cursor-pointer"
              />
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
