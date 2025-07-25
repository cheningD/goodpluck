import type { GoodpluckCart } from "src/lib/types";
import { calculateCartDates } from "./dates";
import { swell } from "..";

/**
 * Get the active carts for session, or create one if none exist.
 * @param sessionToken - the session token from Stytch
 * @returns Cart[]
 * @throws Error when it fails to retrieve the cart
 */
export const getOrCreateCarts = async (
  swellAccountID: string | undefined,
): Promise<GoodpluckCart[]> => {
  const {
    orderingWindowStartDate,
    orderingWindowEndDate,
    orderChargeDate,
    deliveryDate,
  } = calculateCartDates();

  if (!swellAccountID) {
    const cartResponse = await swell.post("/carts", {
      guest: true,
      account_logged_in: false,
      ordering_window_start_date: orderingWindowStartDate,
      ordering_window_end_date: orderingWindowEndDate,
      order_charge_date: orderChargeDate,
      delivery_date: deliveryDate,
      expand: ["items.product", "items.product.vendor"],
    });

    if (cartResponse.errors) {
      throw new Error(JSON.stringify({ errors: cartResponse.errors }));
    }

    return [cartResponse];
  } else {
    const cartsResponse = await swell.get("/carts", {
      where: {
        account_id: swellAccountID,
        delivery_date: { $gte: new Date() },
      },
      sort: "delivery_date asc",
      limit: 25,
      page: 1,
      expand: ["items.product", "items.product.vendor"],
    });

    if (cartsResponse === null || cartsResponse.results.length === 0) {
      const cartResponse = await swell.post("/carts", {
        account_id: swellAccountID,
        guest: false,
        ordering_window_start_date: orderingWindowStartDate,
        ordering_window_end_date: orderingWindowEndDate,
        order_charge_date: orderChargeDate,
        delivery_date: deliveryDate,
        expand: ["items.product", "items.product.vendor"],
      });

      if (cartResponse.errors) {
        throw new Error(JSON.stringify({ errors: cartResponse.errors }));
      }

      return [cartResponse];
    } else if (cartsResponse.errors) {
      throw new Error(JSON.stringify({ errors: cartsResponse.errors }));
    }

    return cartsResponse.results;
  }
};

/**
 * Merges items from the guest cart into the user cart.
 *
 * @param userCart - The cart associated with the user.
 * @param guestCart - The cart associated with the guest.
 * @returns A promise that resolves to the updated user cart.
 */
export const mergeCartItems = async (
  userCart: GoodpluckCart,
  guestCart: GoodpluckCart,
): Promise<GoodpluckCart> => {
  const userCartItems = userCart.items ?? [];
  const guestCartItems = guestCart.items ?? [];

  const updatedUserCart = await swell.put(`/carts/${userCart.id}`, {
    $set: { items: [...userCartItems, ...guestCartItems] },
  });
  return updatedUserCart;
};
