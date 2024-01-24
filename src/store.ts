import { atom } from "nanostores";
// import { persistentMap } from "@nanostores/persistent";
import { createSignal } from "solid-js";
// import type { Cart as CartType } from "swell-js";

// const initialCart: CartType | null = {
//   shipping: {
//     zip: "",
//   },
// };

export const [isSearchVisible, setIsSearchVisible] = createSignal(false);
export const isCartOpen = atom(false);
export const isMenuOpen = atom(false);
export const swellCartId = atom<string | undefined>();
// export const swellCartStore = persistentMap<CartType>("gp_", initialCart, {
//   encode: JSON.stringify,
//   decode: JSON.parse,
// });

// export const updateZip = (newZip: string): void => {
//   basketStore.set({ ...basketStore.get(), zip: newZip });
// };

// export const updateIsValidZip = (isValid: boolean): void => {
//   basketStore.set({ ...basketStore.get(), isValidZip: isValid });
// };

// export const updateOrders = (newOrders: Basket[]): void => {
//   basketStore.set({ ...basketStore.get(), orders: newOrders });
// };
