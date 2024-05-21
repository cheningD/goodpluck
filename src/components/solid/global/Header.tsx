import basket from "src/assets/img/basket.svg";
import wordmark from "src/assets/img/wordmark.svg";
import NavMenu from "src/components/solid/global/NavMenu";
import SideMenu from "src/components/solid/global/SideMenu";
import { type Component } from "solid-js";
import { $isCartOpen } from "src/lib/store";
import { useStore } from "@nanostores/solid";
import AccountButton from "../AccountButton";

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
            class="mx-auto lg:mx-0 h-6 shrink-0"
          />
        </a>

        {/* Navigation Links */}
        <NavMenu collections={collections} />
      </div>
      <div class="flex items-center gap-8">
        {/* Account */}
        <AccountButton />
        {/* Basket */}
        <button
          data-testid="cart-btn"
          onClick={handleButtonClick}
          style={{ "background-image": `url(${basket.src})` }}
          class="w-7 h-7 shrink-0  bg-cover bg-no-repeat relative overflow-hidden"
        />
      </div>
    </header>
  );
};

export default Header;
