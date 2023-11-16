import { useStore } from "@nanostores/solid";
import { Show, type Component } from "solid-js";
import logo from "../../assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../store.js";

const AccountIcon = <IconMdiAccountCircleOutline class="w-6 h-6" />;

const HamburgerIcon = <IconMdiMenu class="w-6 h-6" />;
const CloseMenuIcon = <IconMdiClose class="w-6 h-6" />;

const XIcon = <IconMdiMicrosoftXboxControllerMenu class="w-6 h-6" />;

const ChevronDownIcon = <IconMdiChevronDown class="w-4 h-4" />;

const FacebookIcon = <IconMdiFacebook class="w-6 h-6" />;

// const TiktokIcon = (
//   <IconLogosTiktok class="w-6 h-6" />
// );
const InstaIcon = <IconMdiInstagram class="w-6 h-6" />;

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
            <IconMdiMagnify class="w-6 h-6" />
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
            {/* {TiktokIcon} */}
            {FacebookIcon}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
