/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { swell } from "..";
import calculateCartDates from "./dates";

const {
  orderingWindowStartDate,
  orderingWindowEndDate,
  orderChargeDate,
  deliveryDate,
} = calculateCartDates();

const fetchActiveCart = async (account: any) => {
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
    throw error;
  }
};

const fetchAllCarts = async (account: any) => {
  try {
    return swell.get("/carts/", {
      where: { account_id: account.id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchOrCreateCart = async (account: any) => {
  try {
    const activeCart = await fetchActiveCart(account);
    if (activeCart) {
      console.log("Active cart already exists");
      return activeCart;
    }

    return swell.post("/carts", {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { fetchAllCarts, fetchActiveCart, fetchOrCreateCart };
