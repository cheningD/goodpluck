import { stytch } from "src/lib/stytch";
import { swell } from "..";
import calculateCartDates from "./dates";
import type { Account } from "swell-js";
import type { GoodpluckCart } from "@src/lib/types";

const {
  orderingWindowStartDate,
  orderingWindowEndDate,
  orderChargeDate,
  deliveryDate,
} = calculateCartDates();

/**
 * Get the active cart for the account
 * @param account - the Swell account
 * @returns Cart or null if it fails to retrieve the cart
 * @throws Error when it fails to retrieve the cart
 */
const getCart = async (account: Account): Promise<GoodpluckCart | null> => {
  try {
    const cart = await swell.get("/carts/", {
      where: {
        account_id: account.id,
        ordering_window_start_date: orderingWindowStartDate,
        ordering_window_end_date: orderingWindowEndDate,
        order_charge_date: orderChargeDate,
        delivery_date: deliveryDate,
        active: true,
      },
    });

    if (cart.results && cart.results.length > 0) {
      return cart.results[0];
    } else {
      console.log("No active carts found or results is undefined");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Get the active cart for the account from the session token
 * @param sessionToken - the session token from Stytch
 * @returns Cart or null if it fails to retrieve the cart
 * @throws Error when it fails to retrieve the cart
 */
const getCartFromSession = async (
  sessionToken: string,
): Promise<GoodpluckCart | null> => {
  try {
    const session = await stytch.sessions.authenticate({
      session_token: sessionToken,
    });
    if (!session) {
      throw new Error("Failed to retrieve user session information.");
    }

    const userEmail = session.user.emails?.[0]?.email;
    if (!userEmail) {
      throw new Error("User email is not available in session.");
    }

    const account = await swell.get(`/accounts/${userEmail}`);
    if (!account) {
      throw new Error("Failed to retrieve user account information.");
    }

    const cart = await getCart(account);
    if (!cart) {
      throw new Error("Failed to fetch or create a cart.");
    }

    return cart;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred: ", error.message);
    } else {
      console.error("Error occurred: ", error);
    }
    return null;
  }
};

/**
 * Create a new cart for the account
 * @param account - the Swell account
 * @returns Cart or null if it fails to create the cart
 * @throws Error when it fails to create the cart
 */
const createCart = async (account: Account): Promise<GoodpluckCart | null> => {
  try {
    console.log("Creating a new cart for the account");
    const newCart = await swell.post("/carts", {
      account_id: account.id,
      shipping: account.shipping,
      currency: "USD",
      active: true,
      guest: false,
      ordering_window_start_date: orderingWindowStartDate,
      ordering_window_end_date: orderingWindowEndDate,
      order_charge_date: orderChargeDate,
      delivery_date: deliveryDate,
    });

    return newCart;
  } catch (error) {
    console.error("Error in createCart:", error);
    return null;
  }
};

/**
 * Get the active cart for the account or create a new one if it doesn't exist
 * @param account - the Swell account
 * @returns Cart or null if it fails to retrieve or create the cart
 * @throws Error when it fails to retrieve or create the cart
 */
const getOrCreateCart = async (
  account: Account,
): Promise<GoodpluckCart | null> => {
  try {
    const activeCart = await getCart(account);
    if (activeCart) {
      console.log("Active cart already exists");
      return activeCart;
    }

    return await createCart(account);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getOrCreateCart, getCart, createCart, getCartFromSession };
