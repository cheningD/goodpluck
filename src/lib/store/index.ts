import { persistentAtom } from "@nanostores/persistent";
import { atom, computed, onSet } from "nanostores";
import type {
  GoodpluckAuthResp,
  GoodpluckCart,
  GoodpluckSubscription,
} from "../types";
import type { Account } from "swell-js";

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
import isEqual from "lodash.isequal";

// Track the session token from Stytch
export const $gpSessionToken = persistentAtom<string | undefined>(
  "gp_stytch_session_token",
);

// Fetch and store the authenticated stytch user's session
export const $stytchAuthResp = createFetcherStore<GoodpluckAuthResp>([
  "/api/auth/",
]);

// Check if they are logged into the stytch account (may not have a valid swell account)
export const $isLoggedInStytch = computed<any, typeof $stytchAuthResp>(
  $stytchAuthResp,
  (response) =>
    typeof response.data?.isLoggedInStytch === "boolean"
      ? response.data?.isLoggedInStytch
      : null,
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
  "?ignorePastCarts=true",
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

// Store for fetching the logged-in user's current membership subscription.
export const $subscriptionResp = createFetcherStore<GoodpluckSubscription>([
  "/api/membership/",
]);

export const $subscription = computed([$subscriptionResp], (sub) => sub.data);

// Synchronize subscription items with updated cart items.
// Refresh the cart ID if it changes, for example, when local storage is reset.
// More about store events: https://github.com/nanostores/nanostores?tab=readme-ov-file#store-events
onSet($cart, ({ newValue: cart }) => {
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
  const subscription = $subscription?.value ?? {};
  const subscriptionOneTimeItems =
    // @ts-expect-error - `SubscriptionItems` type does not have a product_id field (https://github.com/swellstores/swell-js/blob/f6a9bb83bc512e17df3d554620252f6cc686c709/types/subscription/snake.d.ts#L19)
    subscription.items?.map(({ product_id: id, quantity }) => ({
      product_id: id,
      quantity,
    })) ?? [];

  // Update one-time items if they differ from the cart items
  // Updating the interval count is necessary to prevent Swell from resetting the interval count to 1
  if (subscription.id && !isEqual(cartProductItems, subscriptionOneTimeItems)) {
    void $updateSwellSubscription.mutate({
      id: subscription.id,
      items: cartProductItems,
      interval_count: subscription.interval_count,
      billing_schedule: {
        interval_count: subscription.interval_count,
      },
    });
  }
});

export const $isCartOpen = atom<boolean>(false);

export const $updateSwellSubscription =
  createMutatorStore<SwellSubscriptionUpdate>(async ({ data, invalidate }) => {
    invalidate(`/api/membership/${data.id}`);
    return await fetch(`/api/membership/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  });

export const $updateCart = createMutatorStore<SwellCartUpdate>(
  async ({ data, invalidate }) => {
    invalidate((key) => key.startsWith(`/api/cart/${data.id}`));
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
    const hasEmptyFields = Object.entries(billingData ?? {})
      .filter(([key]) => key !== "address2")
      .some(([, value]) => !value);
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
