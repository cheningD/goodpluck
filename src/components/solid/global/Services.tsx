import { type Component } from "solid-js";

const Services: Component = () => {
  const $offer = "Thanksgiving";

  return (
    <>
      {/* <!-- Announcement Banner --> */}
      <a
        class="z-10 sticky top-[68px] group block bg-gray-100 hover:bg-gray-200 px-4 py-1 md:px-4 md:py-1 text-center transition-all duration-300 dark:bg-white/[.05] dark:hover:bg-white/[.075]"
        href="#"
      >
        <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
          <p class="group-hover:underline decoration-2 inline-flex justify-center items-center gap-x-2 font-semibold text-blue-600 text-sm dark:text-blue-500">
            Shop now for <span class="text-gray-600">{$offer}</span>
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
          </p>
        </div>
      </a>
      {/* <!-- End Announcement Banner --> */}
    </>
  );
};

export default Services;
