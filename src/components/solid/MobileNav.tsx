import { useStore } from "@nanostores/solid";
import { Show, type Component } from "solid-js";
import logo from "../../assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../store.js";

const HamburgerIcon = (
  <IconMdiMenu class="w-6 h-6"/>
);

const XIcon = (
  <IconMdiMicrosoftXboxControllerMenu class="w-6 h-6"/>
);

const MobileNav: Component = () => {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  const $isMenuOpen = useStore(isMenuOpen);

  return (
    <>
      <nav class="grid grid-cols-3 items-center px-6 h-20 bg-gray-200 gap-0">
        {/* First Column: Menu Button */}
        <div class="flex space-x-4">
          <button
            class="block lg:hidden"
            onClick={() => isMenuOpen.set(!$isMenuOpen())}
          >
            <Show when={$isMenuOpen()} fallback={HamburgerIcon}>
              {XIcon}
            </Show>
          </button>

          {/* Search Icon */}
          <IconMdiMagnify class="w-6 h-6"/>
        </div>

        {/* Center Column: Logo - This should be dead center */}
        <div class="justify-self-center pb-2 ">
          <img src={logo.src} alt="Goodpluck" class="h-8 w-auto" />
        </div>

        {/* 3rd Column: Basket Button */}
        <div class="justify-self-end pr-2 pt-1">
          {/* <button class="relative" onClick={() => isCartOpen.set(!$isCartOpen())}>
            <svg
              class="w-7 h-6"
              viewBox="0 0 24 24"
              id="Line"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="primary"
                d="M15.38,20H8.62a4,4,0,0,1-4-3.6L4,10H20l-.64,6.4A4,4,0,0,1,15.38,20ZM3,10H21M14,4l3,6M7,10l3-6"
                style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px"
              ></path>
            </svg>
            <span class="absolute top-0 right-0 text-xs transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1">
              3
            </span>
          </button> */}
          <a href="" class="text-sm uppercase font-semibold">Login</a>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
