import { useStore } from "@nanostores/solid";
import { isCartOpen } from "../../store";

interface BannerProps {
  readonly isLoggedIn: boolean;
}

export default function Banner({ isLoggedIn }: BannerProps) {
  const $isCartOpen = useStore(isCartOpen);

  return (
    <>
      <div class="w-full max-w-7xl mx-auto hidden lg:flex items-center justify-between bg-gray-800 px-4 py-1 md:px-4 md:py-2 text-center transition-all duration-300 dark:bg-white/[.05] dark:hover:bg-white/[.075]">
        <div class="text-white flex items-center gap-x-10">
          <span class="hover:cursor-pointer hover:underline">About</span>
          <span class="hover:cursor-pointer hover:underline">Recipes</span>
          <span class="hover:cursor-pointer hover:underline">Kitchen</span>
          <span class="hover:cursor-pointer hover:underline">
            Buy a Gift Card
          </span>
        </div>
        <div class="flex items-center gap-x-10">
          <div class="flex items-center text-white gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 hover:cursor-pointer"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M407 24.98v14.04h16V25zM88.99 25v14.03H105V25zM487 57H344.9v15.96H487zm-320 0H25v15.98h142zm256 33.93h-16.1v27.97l13.7.1h2.4zm-318 .1H88.97v28.07H105zm272 45.87l-.1 32.1h-78.5l-16-32h-52.8l-16 32.1l-78.6-.1v-32H55.03l-12.04 48L199 214.4V208c.1-31.4 25.7-56.9 57.1-57c31.3 0 57 25.6 56.9 57c0 4.1.1 6.4.1 6.4L469 185.1L457 137zM256.1 169c-21.6 0-39 17.4-39.1 39.1c.1 21.5 17.5 38.9 39.1 38.9s39-17.4 38.9-39c.1-21.5-17.3-39-38.9-39zm-.2 14c13.8 0 25 11.3 25.1 25c0 13.7-11.3 25.1-25 25c-13.7 0-25.1-11.3-25-24.9c0-13.8 11.3-25 24.9-25.1zm-54.7 40.5L215 279h82l13.9-55.4c-6.8 23.9-28.8 41.4-54.8 41.4c-26.1 0-48.1-17.6-54.9-41.5zm-35.8 4.2L60.35 321.1l83.85 107.7c5-5 11.3-8.8 18.2-11.1L100.2 318l87.9-73l-3.4-13.4zm181.3.2l-19.4 3.8l-3.3 13.4l87.8 73l-62.2 99.6c7 2.3 13.2 6.2 18.3 11.3l83.8-107.8zM176 433.6c-15 0-26.9 11.9-26.9 26.7c0 14.9 11.9 26.7 27 26.8c14.9-.1 26.9-12 26.9-26.8c-.1-14.8-11.9-26.7-27-26.7zm159.9 0c-14.9.1-27 11.9-26.9 26.8c0 14.7 11.9 26.6 27 26.6c15 0 27-11.8 26.9-26.7c.1-14.8-11.9-26.7-27-26.7z"
              />
            </svg>
            <button
              class="hover:cursor-pointer"
              data-hs-overlay-backdrop-container="#sidebar-page"
              data-hs-overlay="#sidebar-mini"
              aria-controls="sidebar-mini"
              aria-label="Toggle navigation"
              onClick={() => isCartOpen.set(!$isCartOpen())}
            >
              Please enter your zip
            </button>
          </div>

          {isLoggedIn ? (
            <div class="flex items-center text-white gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
                />
              </svg>
              <a
                href="/logout"
                class="ml-1 hover:cursor-pointer hover:underline"
              >
                Log out
              </a>
              <div class="inline-block min-h-[1em] w-0.5 self-stretch mx-auto bg-neutral-500 opacity-100"></div>
              <a class="mx-auto hover:cursor-pointer hover:underline">Join</a>
            </div>
          ) : (
            <div class="flex items-center text-white gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
                />
              </svg>
              <a
                href="/login"
                class="ml-1 hover:cursor-pointer hover:underline"
              >
                Login
              </a>
              <div class="inline-block min-h-[1em] w-0.5 self-stretch mx-auto bg-neutral-500 opacity-100"></div>
              <a
                href="/join"
                class="mx-auto hover:cursor-pointer hover:underline"
              >
                Join
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
