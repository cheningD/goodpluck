import { type Component } from "solid-js";

const Footer: Component = () => {
  return (
    <>
      <footer class="relative bg-gray-900 w-full mt-auto">
        <div class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
          {/* <!-- Grid --> */}
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div class="col-span-full lg:col-span-1">
              <a
                class="flex-none text-xl font-semibold text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
                aria-label="Brand"
              >
                GoodPluck
              </a>
            </div>
            {/* <!-- End Col --> */}

            <div class="col-span-1">
              <h4 class="font-semibold text-gray-100">Product</h4>

              <div class="mt-3 grid space-y-3">
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Pricing
                  </a>
                </p>
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Changelog
                  </a>
                </p>
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Docs
                  </a>
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div class="col-span-1">
              <h4 class="font-semibold text-gray-100">Company</h4>

              <div class="mt-3 grid space-y-3">
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    About us
                  </a>
                </p>
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Blog
                  </a>
                </p>
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Careers
                  </a>{" "}
                  <span class="inline ms-1 text-xs bg-orange-900 text-white py-1 px-2 rounded-lg">
                    We're hiring
                  </span>
                </p>
                <p>
                  <a
                    class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Customers
                  </a>
                </p>
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div class="col-span-2">
              <h4 class="font-semibold text-gray-100">Farm to your inbox</h4>

              <form>
                <div class="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-lg p-2 dark:bg-gray-800">
                  <div class="w-full">
                    <label for="hero-input" class="sr-only">
                      Search
                    </label>
                    <input
                      type="text"
                      id="hero-input"
                      name="hero-input"
                      class="py-3 px-4 block w-full border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600"
                      placeholder="Enter your email"
                    />
                  </div>
                  <a
                    class="w-full sm:w-auto whitespace-nowrap p-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-800 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    Subscribe
                  </a>
                </div>
                <p class="mt-3 text-sm text-gray-400">
                  Sign up for the drop on the freshest groceries, recipes, and
                  inspiration.
                </p>
              </form>
            </div>
            {/* <!-- End Col --> */}
          </div>
          {/* <!-- End Grid --> */}

          <div class="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-400">
                © 2023 GoodPluck. All rights reserved.
              </p>
            </div>
            {/* <!-- End Col --> */}

            {/* <!-- Social Brands --> */}
            <div class="flex gap-x-2">
              <a
                class="inline-flex justify-center items-center w-6 h-6 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <circle cx="22.406" cy="9.594" r="1.44" fill="currentColor" />
                  <path
                    fill="currentColor"
                    d="M16 9.838A6.162 6.162 0 1 0 22.162 16A6.162 6.162 0 0 0 16 9.838ZM16 20a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"
                  />
                  <path
                    fill="currentColor"
                    d="M16 6.162c3.204 0 3.584.012 4.849.07a6.642 6.642 0 0 1 2.228.413a3.975 3.975 0 0 1 2.278 2.278a6.642 6.642 0 0 1 .413 2.228c.058 1.265.07 1.645.07 4.85s-.012 3.583-.07 4.848a6.642 6.642 0 0 1-.413 2.228a3.975 3.975 0 0 1-2.278 2.278a6.642 6.642 0 0 1-2.228.413c-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07a6.642 6.642 0 0 1-2.228-.413a3.975 3.975 0 0 1-2.278-2.278a6.642 6.642 0 0 1-.413-2.228c-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849a6.642 6.642 0 0 1 .413-2.228a3.975 3.975 0 0 1 2.278-2.278a6.642 6.642 0 0 1 2.228-.413c1.265-.058 1.645-.07 4.849-.07M16 4c-3.259 0-3.668.014-4.948.072a8.807 8.807 0 0 0-2.912.558a6.136 6.136 0 0 0-3.51 3.51a8.807 8.807 0 0 0-.558 2.913C4.014 12.333 4 12.74 4 16s.014 3.668.072 4.948a8.807 8.807 0 0 0 .558 2.912a6.136 6.136 0 0 0 3.51 3.51a8.807 8.807 0 0 0 2.913.558c1.28.058 1.688.072 4.947.072s3.668-.014 4.948-.072a8.807 8.807 0 0 0 2.913-.558a6.136 6.136 0 0 0 3.51-3.51a8.807 8.807 0 0 0 .557-2.913C27.986 19.667 28 19.26 28 16s-.014-3.668-.072-4.948a8.807 8.807 0 0 0-.558-2.912a6.136 6.136 0 0 0-3.51-3.51a8.807 8.807 0 0 0-2.913-.557C19.667 4.013 19.26 4 16 4Z"
                  />
                </svg>
              </a>
              <a
                class="inline-flex justify-center items-center w-6 h-6 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"
                  />
                </svg>
              </a>
              <a
                class="inline-flex justify-center items-center w-6 h-6 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M18 2a1 1 0 0 1 .993.883L19 3v4a1 1 0 0 1-.883.993L18 8h-3v1h3a1 1 0 0 1 .991 1.131l-.02.112l-1 4a1 1 0 0 1-.858.75L17 15h-2v6a1 1 0 0 1-.883.993L14 22h-4a1 1 0 0 1-.993-.883L9 21v-6H7a1 1 0 0 1-.993-.883L6 14v-4a1 1 0 0 1 .883-.993L7 9h2V8a6 6 0 0 1 5.775-5.996L15 2h3z"
                    />
                  </g>
                </svg>
              </a>
            </div>
            {/* <!-- End Social Brands --> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
