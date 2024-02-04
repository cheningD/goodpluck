import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { createSignal } from "solid-js";
import type { Product } from "swell-js";

export const [isSearchVisible, setIsSearchVisible] = createSignal(false);
export const [isBasketUpdated, setIsBasketUpdated] = createSignal(false);
export const [lastBasketItemAdded, setLastBasketItemAdded] =
  createSignal<Product | null>(null);
export const isCartOpen = atom(false);
export const isMenuOpen = atom(false);
export const swellCartId = persistentAtom<string | undefined>(
  "guest_cart_id",
  undefined,
);
export const swellCartDeliveryDate = persistentAtom<string | undefined>(
  "guest_cart_delivery_date",
  undefined,
);
