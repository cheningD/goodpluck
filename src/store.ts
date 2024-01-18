import { atom } from "nanostores";
import { persistentMap } from "@nanostores/persistent";
import { type Basket } from "@composables/basketUtils";
import { createSignal } from "solid-js";

interface Cart {
  zip: string;
  isValidZip: boolean;
  deliverySlots: string[];
  selectedSlot: string;
  orders: Basket[];
  activeOrder: Basket | null;
}

const initialCart: Cart = {
  zip: "",
  isValidZip: false,
  deliverySlots: [],
  selectedSlot: "",
  orders: [],
  activeOrder: null,
};

export const [isSearchVisible, setIsSearchVisible] = createSignal(false);
export const isCartOpen = atom(false);
export const isMenuOpen = atom(false);
export const basketStore = persistentMap<Cart>("gp_", initialCart, {
  encode(value) {
    return String(value);
  },
  decode(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  },
});

export const updateZip = (newZip: string): void => {
  basketStore.set({ ...basketStore.get(), zip: newZip });
};

export const updateIsValidZip = (isValid: boolean): void => {
  basketStore.set({ ...basketStore.get(), isValidZip: isValid });
};

export const updateSelectedSlot = (slot: string): void => {
  basketStore.set({ ...basketStore.get(), selectedSlot: slot });
};

export const updateOrders = (newOrders: Basket[]): void => {
  basketStore.set({ ...basketStore.get(), orders: newOrders });
};

export const updateActiveOrder = (newOrder: Basket): void => {
  basketStore.set({ ...basketStore.get(), activeOrder: newOrder });
};

// export const isZipCodeSet = computed(baskets, carts => {
//   return carts && carts.length > 0
// })
