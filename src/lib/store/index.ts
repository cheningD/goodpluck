import { atom, computed } from "nanostores";
import type { GoodpluckCart } from "../types";
import { persistentAtom } from "@nanostores/persistent";

import { createFetcherStore } from "./fetcher";
import { type SessionsAuthenticateResponse } from "stytch";
import { logger } from "@nanostores/logger";

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

// Track the guest cart ID
export const $guestCartID = persistentAtom<string>("gp_guest_cart_id", "");

// Fetch and store the guest cart
// Issue: this will create an account even if user is logged in.
export const $guestCart = createFetcherStore<GoodpluckCart>(
  [`/api/guestcart/`, $guestCartID, $isGuest],
  {
    fetcher: async (a, b, c) => {
      if (c === true) {
        const resp = await fetch(`${a}${b}`);
        if (resp.ok) {
          return await resp.json();
        }
      }
    },
  },
);

export const $authenticatedCart = createFetcherStore<GoodpluckCart>([
  `/api/cart/`,
  $swellAccountId,
]);

export const $cart = computed(
  [$guestCart, $authenticatedCart],
  (guest, auth) => auth.data ?? guest.data,
);

export const $zip = computed([$cart], (cart) => cart?.shipping?.zip);

export const $isCartOpen = atom<boolean>(false);

// Console debug statements
$guestCart.listen((guestCart) => {
  const updatedGuestCartID = guestCart.data?.id;
  if (updatedGuestCartID) {
    $guestCartID.set(updatedGuestCartID);
  }
});

logger({
  "Guest Cart": $guestCart,
  //   "Authenticated Cart": $authenticatedCart,
  //   Cart: $cart,
  "Swell Acc ID": $swellAccountId,
  "Stytch Auth Resp": $stytchAuthResp,
  "Session Token": $gpSessionToken,
  "Is Guest": $isGuest,
  GuestCartID: $guestCartID,
});
