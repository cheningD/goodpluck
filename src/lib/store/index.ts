import { persistentAtom } from "@nanostores/persistent";
import { atom, computed, onSet } from "nanostores";
import type { GoodpluckCart } from "../types";

import { logger } from "@nanostores/logger";
import { type SessionsAuthenticateResponse } from "stytch";
import { createFetcherStore, createMutatorStore } from "./fetcher";

// Track the session token from Stytch
export const $gpSessionToken = persistentAtom<string | undefined>(
  "gp_stytch_session_token",
);

// Fetch and store the authenticated stytch user's session
export const $stytchAuthResp = createFetcherStore<SessionsAuthenticateResponse>(
  ["/api/auth/", $gpSessionToken],
);

// Extract the Swell account ID from the stytch user's trusted metadata
const $swellAccountId = computed<string | null, typeof $stytchAuthResp>(
  $stytchAuthResp,
  (response) => response.data?.user.trusted_metadata?.swell_account_id ?? null,
);

// Is the user a guest
const $isGuest = computed([$swellAccountId], (accountId) => !accountId);

// Save an ID to the current cart
export const $currentCartID = persistentAtom<string | undefined>(
  "current_cart_id",
);

export const $currentCart = createFetcherStore<GoodpluckCart>([
  `/api/cart/`,
  $currentCartID,
]);

export const $carts = createFetcherStore<GoodpluckCart[]>([`/api/cart/`]);

// If there is no currentCart, use first cart in the list of carts
export const $cart = computed(
  [$carts, $currentCart],
  (carts, currentCart) => currentCart.data ?? carts.data?.[0],
);

// Save the category ID to the currentCartId store (https://github.com/nanostores/nanostores?tab=readme-ov-file#store-events)
onSet($cart, ({ newValue }) => {
  if (newValue?.id) {
    $currentCartID.set(newValue.id);
  }
});

export const $isCartOpen = atom<boolean>(false);

interface ShippingInfo {
  name?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

interface CartUpdate {
  id: string;
  shipping: ShippingInfo;
}

export const $updateShipping = createMutatorStore<CartUpdate>(
  async ({ data, invalidate }) => {
    invalidate(`/api/cart/${data.id}`);
    return await fetch(`/api/cart/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
);

// Watch these stores and output changes to the console
logger({
  Cart: $cart,
  "Swell Acc ID": $swellAccountId,
  "Stytch Auth Resp": $stytchAuthResp,
  "Session Token": $gpSessionToken,
  "Is Guest": $isGuest,
});
