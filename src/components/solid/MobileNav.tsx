import { useStore } from "@nanostores/solid";
import { Show, type Component } from "solid-js";
import logo from "../../assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../store.js";

const AccountIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78A7.893 7.893 0 0 1 12 20c-1.86 0-3.57-.64-4.93-1.72m11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.928 7.928 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.5-1.64 4.83M12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6m0 5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 8a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 11Z"
    />
  </svg>
);

const HamburgerIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
  </svg>
);

const CloseMenuIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
    />
  </svg>
);

const XIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M6 7h12v2H6V7m0 4h12v2H6v-2m0 4h12v2H6v-2Z"
    />
  </svg>
);

const ChevronDownIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"
    />
  </svg>
);

const FacebookIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"
    />
  </svg>
);

const InstaIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"
    />
  </svg>
);

const MobileNav: Component = () => {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  const $isMenuOpen = useStore(isMenuOpen);

  return (
    <>
      <nav class="flex flex-col">
        <div class="grid grid-cols-3 items-center px-6 h-16 gap-0">
          {/* First Column: Menu Button */}
          <div class="flex space-x-4">
            <button
              class="block lg:hidden"
              onClick={() => isMenuOpen.set(!$isMenuOpen())}
            >
              <Show when={!$isMenuOpen()} fallback={CloseMenuIcon}>
                {HamburgerIcon}
              </Show>
            </button>

            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 cursor-pointer"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z"
              />
            </svg>
          </div>

          {/* Center Column: Logo - This should be dead center */}
          <div class="justify-self-center pb-2 ">
            <img src={logo.src} alt="Goodpluck" class="h-8 w-auto" />
          </div>

          {/* 3rd Column: Basket Button */}
          <div class="justify-self-end pr-2 pt-1">
            <a href="" class="text-sm uppercase font-semibold text-orange-800">
              Login
            </a>
          </div>
        </div>

        <div class="bg-slate-50 h-full flex flex-col gap-y-4">
          <ul class="font-medium text-gray-800 hover:text-gray-600 transition-all duration-300 md:block w-full flex flex-col border-t-2 border-dashed border-gray-100 px-6">
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Farm Boxes</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Thanksgiving</a>
              <button type="button" class="block lg:hidden">
                {ChevronDownIcon}
              </button>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Produce</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Meat & Seafood</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Dairy & Eggs</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Bakery</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Easy Meals</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Drinks</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Pantry</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">New & Seasonal</a>
            </li>
          </ul>

          <div class="grid grid-cols-3 bg-amber-100 px-6 py-3">
            <div class="flex mx-auto">
              {AccountIcon}
              <a class="ml-1">Login</a>
            </div>
            <div class="inline-block min-h-[1em] w-0.5 self-stretch mx-auto bg-neutral-500 opacity-100"></div>
            <a class="mx-auto">Join</a>
          </div>

          <ul class="font-medium text-gray-800 hover:text-gray-600 transition-all duration-300 md:block w-full flex flex-col border-t-2 border-dashed border-gray-100 px-6">
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">About</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Recipes</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Kitchen</a>
            </li>
            <li class="flex gap-x-1 border-b-2 border-dashed border-gray-100 py-2">
              <a href="">Buy a Gift Card</a>
            </li>
          </ul>

          <img src={logo.src} alt="Goodpluck" class="h-8 w-5 mx-auto" />

          <div class="flex justify-center gap-x-3">
            {InstaIcon}
            {FacebookIcon}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
