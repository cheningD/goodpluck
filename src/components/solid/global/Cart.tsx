import { type Component } from "solid-js";

const Cart: Component = () => {
  return (
    <>
      <div id="sidebar-page" class="relative w-full h-auto py-5">
        {/* Start SpySidbar */}
        <div class="grid grid-cols-4">
          <div class="hidden  lg:flex flex-col items-center">
            <h2 class="text-xl font-medium dark:text-white">Navbar</h2>
            <ul
              class="w-1/2 sticky top-[114px]"
              data-hs-scrollspy="#scrollspy-2"
              data-hs-scrollspy-scrollable-parent="#sidebar-page"
            >
              <li data-hs-scrollspy-group>
                <a
                  href="#item-1"
                  class="block py-0.5 text-sm font-medium leading-6 text-slate-700 hover:text-slate-900 focus:outline-none focus:text-blue-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                >
                  Item 1
                </a>
                <ul>
                  <li class="ms-4">
                    <a
                      href="#item-1-1"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 1-1
                    </a>
                  </li>
                  <li class="ms-4">
                    <a
                      href="#item-1-2"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 1-2
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#item-2"
                  class="block py-0.5 text-sm font-medium leading-6 text-slate-700 hover:text-slate-900 focus:outline-none focus:text-blue-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
                >
                  Item 2
                </a>
              </li>
              <li data-hs-scrollspy-group>
                <a
                  href="#item-3"
                  class="block py-0.5 text-sm font-medium leading-6 text-slate-700 hover:text-slate-900 focus:outline-none focus:text-blue-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
                >
                  Item 3
                </a>
                <ul>
                  <li class="ms-4">
                    <a
                      href="#item-3-1"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 3-1
                    </a>
                  </li>
                  <li class="ms-4">
                    <a
                      href="#item-3-2"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 3-2
                    </a>
                  </li>
                </ul>
              </li>
              <li data-hs-scrollspy-group>
                <a
                  href="#item-4"
                  class="block py-0.5 text-sm font-medium leading-6 text-slate-700 hover:text-slate-900 focus:outline-none focus:text-blue-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
                >
                  Item 4
                </a>
                <ul>
                  <li class="ms-4">
                    <a
                      href="#item-4-1"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 4-1
                    </a>
                  </li>
                  <li class="ms-4">
                    <a
                      href="#item-4-2"
                      class="group flex items-center gap-x-2 py-0.5 text-sm text-gray-700 leading-6 hover:text-gray-800 focus:outline-none focus:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Item 4-2
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="col-span-3 px-4">
            <div id="scrollspy-2" class="space-y-4">
              <div id="item-1">
                <h3 class="text-lg font-semibold dark:text-white">Item 1</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-1-1">
                <h3 class="text-lg font-semibold dark:text-white">Item 1-1</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-1-2">
                <h3 class="text-lg font-semibold dark:text-white">Item 1-2</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-2">
                <h3 class="text-lg font-semibold dark:text-white">Item 2</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-3">
                <h3 class="text-lg font-semibold dark:text-white">Item 3</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-3-1">
                <h3 class="text-lg font-semibold dark:text-white">Item 3-1</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-3-2">
                <h3 class="text-lg font-semibold dark:text-white">Item 3-2</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-4">
                <h3 class="text-lg font-semibold dark:text-white">Item 4</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-4-1">
                <h3 class="text-lg font-semibold dark:text-white">Item 4-1</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>

              <div id="item-4-2">
                <h3 class="text-lg font-semibold dark:text-white">Item 4-2</h3>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  This is some placeholder content for the scrollspy page. Note
                  that as you scroll down the page, the appropriate navigation
                  link is highlighted. It's repeated throughout the component
                  example. We keep adding some more example copy here to
                  emphasize the scrolling and highlighting.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End SpySidbar */}

        <div
          id="sidebar-mini"
          data-hs-overlay-keyboard="true"
          class="w-1/3 [--overlay-backdrop:null] hs-overlay hs-overlay-open:translate-x-0 translate-x-full absolute top-0 end-0 transition-all duration-300 transform h-full max-w-sm z-[60] bg-white border-s dark:bg-gray-800 dark:border-gray-700 hidden"
          tabindex="-1"
        >
          <nav
            class="relative z-0 flex border overflow-hidden dark:border-gray-700"
            aria-label="Tabs"
            role="tablist"
          >
            <button
              type="button"
              class="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-s-0 border-s border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-2xl font-serif text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-400 active"
              id="bar-with-underline-item-1"
              data-hs-tab="#bar-with-underline-1"
              aria-controls="bar-with-underline-1"
              role="tab"
            >
              Enter Zip
            </button>
            <button
              type="button"
              class="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-slate-100 first:border-s-0 border-s border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-2xl font-serif text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-400"
              id="bar-with-underline-item-2"
              data-hs-tab="#bar-with-underline-2"
              aria-controls="bar-with-underline-2"
              role="tab"
            >
              Select Date
            </button>
          </nav>

          <div class="mt-3 h-full">
            <div
              id="bar-with-underline-1"
              role="tabpanel"
              aria-labelledby="bar-with-underline-item-1"
              class=" h-full"
            >
              <form class="p-4 flex flex-col h-full gap-y-10">
                <p class="text-gray-500 dark:text-gray-400">
                  Before we add items to your order, let's{" "}
                  <em class="font-semibold text-gray-800 dark:text-gray-200">
                    confirm
                  </em>{" "}
                  we deliver to your area.
                </p>
                <div class="flex flex-col gap-y-3">
                  <input
                    type="text"
                    class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Zip Code"
                  />
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?
                    <a
                      class="text-blue-600 ml-1 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      href="../examples/html/signup.html"
                    >
                      Sign In here
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  class="w-3/4 uppercase mx-auto py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-orange-800 text-white hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  Check
                </button>
              </form>
            </div>
            <div
              id="bar-with-underline-2"
              class="hidden"
              role="tabpanel"
              aria-labelledby="bar-with-underline-item-2"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
