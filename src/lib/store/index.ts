import { persistentAtom } from "@nanostores/persistent";
import { atom, computed, onSet } from "nanostores";
import type { GoodpluckCart } from "../types";
import type { Account, Subscription } from "swell-js";

import { logger } from "@nanostores/logger";

import { createFetcherStore, createMutatorStore } from "./fetcher";
import {
  type SwellAccountCardCreate,
  type SwellAccountCardUpdate,
  type SwellAccountCreate,
  type SwellAccountUpdate,
  type SwellCartItemsPutArgs,
  type SwellCartUpdate,
  type SwellSubscriptionUpdate,
} from "src/schemas/zod/swell";
import type { SessionsAuthenticateResponse } from "../stytch_types_b2c";
import isEqual from "lodash.isequal";

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

export const $swellAccountResp = createFetcherStore<Account>([
  `/api/account/`,
  $swellAccountId,
]);

export const $swellAccount = computed(
  [$swellAccountResp],
  (account) => account.data,
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
const $shouldFetchCarts = computed(
  [$currentCart],
  (currentCart) => !currentCart.loading && !currentCart.data?.id,
);

export const $carts = createFetcherStore<GoodpluckCart[]>([
  `/api/cart?shouldFetchCarts=`,
  $shouldFetchCarts,
]);

// If there is no currentCart, use first cart in the list of carts
export const $cart = computed([$carts, $currentCart], (carts, currentCart) => {
  if (currentCart.data?.id) {
    return currentCart.data;
  } else {
    return carts.data?.[0];
  }
});

// Store for fetching the logged-in user's current subscription details.
export const $subscription = createFetcherStore<Subscription>([
  `/api/subscription/`,
  $swellAccountId,
]);

// Save the category ID to the currentCartId store (https://github.com/nanostores/nanostores?tab=readme-ov-file#store-events)
onSet($cart, ({ newValue: cart }) => {
  // Update current cart ID if it differs from the new cart ID
  if (cart?.id && cart.id !== $currentCartID.value) {
    $currentCartID.set(cart.id);
  }

  // Map cart items to product items format
  const cartProductItems =
    cart?.items?.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    })) ?? [];

  // Map subscription items to one-time items format
  const subscription = $subscription?.value?.data ?? {};
  const subscriptionOneTimeItems =
    subscription.items?.map(({ id, quantity }) => ({
      product_id: id,
      quantity,
    })) ?? [];

  // Update one-time items if they differ from the cart items
  if (subscription.id && !isEqual(cartProductItems, subscriptionOneTimeItems)) {
    void $updateSwellSubscription.mutate({
      id: subscription.id,
      items: cartProductItems,
    });
  }
});

export const $isCartOpen = atom<boolean>(false);

export const $updateSwellSubscription =
  createMutatorStore<SwellSubscriptionUpdate>(async ({ data, invalidate }) => {
    invalidate(`/api/subscription/${data.id}`);
    return await fetch(`/api/subscription/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  });

export const $updateCart = createMutatorStore<SwellCartUpdate>(
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

export const $createSwellAccount = createMutatorStore<SwellAccountCreate>(
  async ({ data, invalidate }) => {
    const createAccountResp = await fetch("/api/account/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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

export const $updateSwellAccount = createMutatorStore<SwellAccountUpdate>(
  async ({ data, invalidate }) => {
    invalidate(`/api/account/${data.id}`);
    return await fetch(`/api/account/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
);

export const $createSwellAccountCard =
  createMutatorStore<SwellAccountCardCreate>(async ({ data }) => {
    const billingData = data.billing;
    const hasEmptyFields = Object.values(billingData).some((field) => !field);
    const billing = hasEmptyFields ? null : billingData;

    const resp = await fetch("/api/account/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent_id: data.parent_id,
        token: data.token,
        billing,
      }),
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      throw new Error(message);
    }
  });

export const $updateSwellAccountCard =
  createMutatorStore<SwellAccountCardUpdate>(async ({ data }) => {
    const resp = await fetch(`/api/account/card/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      throw new Error(message);
    }
  });

// Watch these stores and output changes to the console
logger({
  Cart: $cart,
  Carts: $carts,
  Account: $swellAccount,
  Subscription: $subscription,
  "Swell Acc ID": $swellAccountId,
  "Stytch Auth Resp": $stytchAuthResp,
  "Session Token": $gpSessionToken,
  "Is Guest": $isGuest,
});
