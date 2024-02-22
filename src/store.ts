import { atom } from "nanostores";
import { createSignal } from "solid-js";

export const $isCartOpen = atom(false);
export const isMenuOpen = atom(false);

export const [isSearchVisible, setIsSearchVisible] = createSignal(false);
