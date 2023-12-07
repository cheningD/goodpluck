import { createSignal, Show, For, type Component } from "solid-js";
import logo from "@assets/logo.png";
import Sidebar from "@components/solid/global/Sidebar.tsx";

interface IProps {
  collections: any;
}

const Header: Component<IProps> = ({ collections }) => {
  const [isSearchOpen, setSearchOpen] = createSignal(false);
  const toggleSearch = () => setSearchOpen(!isSearchOpen());

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z"
                    />
                  </svg>
                </div>
                {/* Center Column: Logo - This should be dead center */}
                <div class="justify-self-center pb-2 lg:pr-6">
                  <img
                    src={logo.src}
                    alt="Goodpluck"
                    width="32"
                    height="32"
                    class="h-8 w-auto"
                  />
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
              <Sidebar collections={collections} />
            </Show>

            <div class="hidden lg:flex items-center gap-x-4">
              {/* Search Icon */}
              <svg
                onClick={toggleSearch}
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 cursor-pointer"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z"
                />
              </svg>

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
