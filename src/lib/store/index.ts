import { persistentAtom } from "@nanostores/persistent";
import { atom, computed, onSet } from "nanostores";
import type { GoodpluckCart } from "../types";

import { logger } from "@nanostores/logger";
import { type SessionsAuthenticateResponse } from "stytch";
import { createFetcherStore, createMutatorStore } from "./fetcher";
import {
  type SwellCartItemsPutArgs,
  type SwellCartUpdate,
} from "@src/schemas/zod/swell";

// Track the session token from Stytch
export const $gpSessionToken = persistentAtom<string | undefined>(
  "gp_stytch_session_token",
);

// Fetch and store the authenticated stytch user's session
export const $stytchAuthResp = createFetcherStore<SessionsAuthenticateResponse>(
  ["/api/auth/"],
);

// Extract the Swell account ID from the stytch user's trusted metadata
export const $swellAccountId = computed<string | null, typeof $stytchAuthResp>(
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

// Only fetch carts if the currentCart has been loaded but does not have an ID (cart not found)
const $shouldFetchCarts = computed([$currentCart], (currentCart) => {
  return !!currentCart.data && !currentCart.data.id;
});

export const $carts = createFetcherStore<GoodpluckCart[]>([
  `/api/cart?shouldFetchCarts=`,
  $shouldFetchCarts,
]);

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

interface AccountCreate {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  emailOptin: boolean;
  email: string;
}

export const $createSwellAccount = createMutatorStore<AccountCreate>(
  async ({ data, invalidate }) => {
    const createAccountResp = await fetch("/api/account/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        email_optin: data.emailOptin,
        email: data.email,
        shipping: {
          address1: data.address,
          address2: data.apartment,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
      }),
    });

    if (!createAccountResp.ok) {
      const { message } = await createAccountResp.json();
      throw new Error(message);
    }

    const {
      account: { id },
    } = await createAccountResp.json();
    invalidate("/api/auth");
    const updateStytchResp = await fetch("/api/auth/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trusted_metadata: { swell_account_id: id },
      }),
    });

    const updateStytchData = await updateStytchResp.json();

    if (!updateStytchResp.ok) {
      const { message } = await updateStytchResp.json();
      throw new Error(message);
    }

    return updateStytchData;
  },
);

interface SwellPaymentInfo {
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip?: string;
  token: string;
  accountId: string;
}

export const $createSwellAccountCard = createMutatorStore<SwellPaymentInfo>(
  async ({ data }) => {
    const billingData = {
      address1: data.address,
      address2: data.apartment,
      city: data.city,
      state: data.state,
      zip: data.zip,
    };

    const hasEmptyFields = Object.values(billingData).some((field) => !field);
    const billing = hasEmptyFields ? null : billingData;

    const resp = await fetch("/api/account/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent_id: data.accountId,
        token: data.token,
        billing,
      }),
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      throw new Error(message);
    }
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
