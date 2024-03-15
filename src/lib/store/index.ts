import { persistentAtom } from "@nanostores/persistent";
import { atom, computed, onSet } from "nanostores";
import type { GoodpluckCart } from "../types";
import { type Account as SwellAccount } from "swell-js";

import { logger } from "@nanostores/logger";
import { type SessionsAuthenticateResponse } from "stytch";
import { createFetcherStore, createMutatorStore } from "./fetcher";
import {
  type SwellCartItemsPutArgs,
  type SwellCartUpdate,
} from "@src/schemas/zod";

// Track the session token from Stytch
export const $gpSessionToken = persistentAtom<string | undefined>(
  "gp_stytch_session_token",
);

// Fetch and store the authenticated stytch user's session
export const $stytchAuthResp = createFetcherStore<SessionsAuthenticateResponse>(
  ["/api/auth/"],
);

// Extract the Swell account ID from the stytch user's trusted metadata
const $swellAccountId = computed<string | null, typeof $stytchAuthResp>(
  $stytchAuthResp,
  (response) => response.data?.user?.trusted_metadata?.swell_account_id ?? null,
);

// Is the user a guest
const $isGuest = computed([$swellAccountId], (accountId) => !accountId);

// Save an ID to the current cart
export const $currentCartID = persistentAtom<string>("current_cart_id");

export const $currentCart = createFetcherStore<GoodpluckCart>([
  `/api/cart/`,
  $currentCartID,
]);

export const $carts = createFetcherStore<GoodpluckCart[]>([`/api/cart`]);

// If there is no currentCart, use first cart in the list of carts
export const $cart = computed(
  [$carts, $currentCart],
  (carts, currentCart) => currentCart.data ?? carts.data?.[0],
);

// Save the category ID to the currentCartId store (https://github.com/nanostores/nanostores?tab=readme-ov-file#store-events)
onSet($cart, ({ newValue }) => {
  if (newValue?.id && newValue?.id !== $currentCartID.value) {
    $currentCartID.set(newValue.id);
  }
});

export const $isCartOpen = atom<boolean>(false);

export const $updateShipping = createMutatorStore<SwellCartUpdate>(
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

export const $updateCartItems = createMutatorStore<SwellCartItemsPutArgs>(
  async ({ data, invalidate }) => {
    invalidate(`/api/cart/${data.cartId}`);
    return await fetch(`/api/cart/items/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
);

export const $createSwellAccount = createMutatorStore<SwellAccount>(
  async ({ data, invalidate }) => {
    // Create a new account in Swell
    const createAccountResp = await fetch("/api/account/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const createAccountData = await createAccountResp.json();

    if (!createAccountResp.ok) {
      throw new Error(createAccountData.message);
    }

    // Update the stytch user with the new account ID
    const swellAccountId = createAccountData.account.id;
    invalidate("/api/auth");
    const updateStytchResp = await fetch("/api/auth/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swellAccountId }),
    });

    const updateStytchData = await updateStytchResp.json();

    if (!updateStytchResp.ok) {
      throw new Error(updateStytchData.message);
    }

    return updateStytchData;
  },
);

// Watch these stores and output changes to the console
logger({
  Cart: $cart,
  Carts: $carts,
  "Swell Acc ID": $swellAccountId,
  "Stytch Auth Resp": $stytchAuthResp,
  "Session Token": $gpSessionToken,
  "Is Guest": $isGuest,
});
