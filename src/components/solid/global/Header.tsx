import basket from "src/assets/img/basket.svg";
import search from "src/assets/img/search.svg";
import user from "src/assets/img/user.svg";
import wordmark from "src/assets/img/wordmark.svg";
import NavMenu from "src/components/solid/global/NavMenu";
import SideMenu from "src/components/solid/global/SideMenu";
import { type Component } from "solid-js";
import { $isCartOpen } from "src/lib/store";
import { useStore } from "@nanostores/solid";

interface HeaderProps {
  collections: any;
}

const Header: Component<HeaderProps> = ({ collections }) => {
  const isCartOpen = useStore($isCartOpen);
  const handleButtonClick = (): void => {
    $isCartOpen.set(!isCartOpen());
  };

  return (
    <header class="sticky top-0 z-50 flex justify-between items-center h-20 px-4 lg:px-12 bg-white">
      {/* Menu */}
      <SideMenu collections={collections} />
      <div class="flex gap-10 shrink-0">
        {/* Logo */}
        <a href="/">
          <img
            src={wordmark.src}
            alt="Goodpluck Logo"
            class="mx-auto lg:mx-0 h-6 shrink-0 color-brand-green"
          />
        </a>

        {/* Navigation Links */}
        <NavMenu collections={collections} />
      </div>
      <div class="flex items-center gap-8">
        {/* Search Box */}
        <div class="hidden lg:flex relative w-64 h-10">
          <input
            class="w-full h-full shrink-0 pl-4 pr-10 bg-transparent rounded-md border-solid focus:border-transparent focus:ring-2  focus:ring-brand-green  border-stone-200 placeholder-stone-400 shadow "
            placeholder="Search"
            type="text"
          />

          <img
            src={search.src}
            class="shrink-0 absolute right-4 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* Account */}
        <button
          style={{ "background-image": `url(${user.src})` }}
          class="hidden lg:flex w-7 h-7 shrink-0  bg-cover bg-no-repeat relative overflow-hidden"
        />
        {/* Basket */}
        <button
          onClick={handleButtonClick}
          style={{ "background-image": `url(${basket.src})` }}
          class="w-7 h-7 shrink-0  bg-cover bg-no-repeat relative overflow-hidden"
        />
      </div>
    </header>
  );
};

export default Header;
