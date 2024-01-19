import { atom } from "nanostores";
import { persistentMap } from "@nanostores/persistent";
import { type Basket } from "@composables/basketUtils";
import { createSignal } from "solid-js";

interface Cart {
  zip: string;
  isValidZip: boolean;
  orders: Basket[];
}

const initialCart: Cart = {
  zip: "",
  isValidZip: false,
  orders: [],
};

export const [isSearchVisible, setIsSearchVisible] = createSignal(false);
export const isCartOpen = atom(false);
export const isMenuOpen = atom(false);
export const basketStore = persistentMap<Cart>("gp_", initialCart, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const updateZip = (newZip: string): void => {
  basketStore.set({ ...basketStore.get(), zip: newZip });
};

export const updateIsValidZip = (isValid: boolean): void => {
  basketStore.set({ ...basketStore.get(), isValidZip: isValid });
};

export const updateOrders = (newOrders: Basket[]): void => {
  basketStore.set({ ...basketStore.get(), orders: newOrders });
};
