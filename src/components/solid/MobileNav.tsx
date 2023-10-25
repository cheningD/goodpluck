import { createSignal } from "solid-js";
import logo from "../../assets/logo.png";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <nav class="sticky flex justify-between items-center p-4 bg-white">
      <div class="flex space-x-2.5">
        <button onClick={() => setIsMenuOpen(!isMenuOpen())}>
          {/* Hamburger icon */}
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>

        {/* Search icon */}
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.468 6.468 0 004.23-1.5l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>

      {/* Logo */}
      <div class="text-center">
        <img src={logo.src} alt="Goodpluck" class="h-6 w-auto" />
      </div>

      {/* Basket button */}
      <button class="relative">
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          {/* Insert your basket SVG path here */}
        </svg>
        <span class="absolute top-0 right-0 p-1">1</span>
      </button>
      {`isMenuOpen?: ${isMenuOpen()}`}

      {/* Sidebar Menu */}
      {isMenuOpen() && (
        <aside class="fixed inset-y-0 left-0 bg-gray-200 w-4/5">
          {/* Close button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            class="absolute top-0 right-0 m-4 p-2 bg-white"
          >
            ✖
          </button>

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
        </aside>
      )}
    </nav>
  );
}
