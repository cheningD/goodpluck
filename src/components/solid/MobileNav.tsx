import { type Component, Show, createSignal } from "solid-js";
import { Motion, Presence } from "@motionone/solid";
import logo from "../../assets/logo.png";

const HamburgerIcon = (
  <svg class="w-8 h-8" viewBox="0 0 24 24">
    <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
  </svg>
);

const XIcon = (
  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MobileNav: Component = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <div>
      <nav class="grid grid-cols-3 items-center px-6 h-20 bg-gray-200 gap-0">
        {/* First Column: Menu Button */}
        <div class="flex space-x-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen())}>
            <Show when={isMenuOpen()} fallback={HamburgerIcon}>
              {XIcon}
            </Show>
          </button>

          {/* Search Icon */}
          <svg class="w-7 h-7 pt-1" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.468 6.468 0 004.23-1.5l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>

        {/* Center Column: Logo - This should be dead center */}
        <div class="justify-self-center pb-2 ">
          <img src={logo.src} alt="Goodpluck" class="h-8 w-auto" />
        </div>

        {/* 3rd Column: Basket Button */}
        <div class="justify-self-end pr-2 pt-1">
          <button class="relative">
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
          </button>
        </div>
      </nav>
      {/* Sidebar Menu */}
      <Presence exitBeforeEnter>
        <Show when={isMenuOpen()}>
          <Motion.aside
            class="fixed top-20 bottom-0 left-0 bg-gray-100 w-4/5"
            animate={{
              x: 0,
            }}
            initial={{
              x: -600,
            }}
            exit={{
              x: -600,
            }}
            transition={{
              duration: 0.5,
              easing: "ease-in-out",
            }}
          >
            {/* Content of the sidebar */}
            <div class="p-4">
              {/* Logo */}
              <img src={logo.src} alt="Goodpluck" class="h-8 w-auto my-4" />

              {/* Menu Items */}
              <div class="space-y-4">
                <div>About</div>
                <div>Recipes</div>
                <div>Kitchen & Bar</div>
                <div>Buy a Gift Card</div>
              </div>

              {/* Social Links */}
              <div class="absolute bottom-0 left-4 flex space-x-4">
                {/* ... social icons */}
              </div>
            </div>
          </Motion.aside>
        </Show>
      </Presence>
    </div>
  );
};

export default MobileNav;
