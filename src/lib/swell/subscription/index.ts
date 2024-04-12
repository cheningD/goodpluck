import { swell } from "..";
import type { Subscription } from "swell-js";

interface CartItem {
  id: string | undefined;
  quantity: number | undefined;
}

/**
 * Get or create a subscription for the Swell account.
 * Attempts to get the subscription for the account, and if none exist, creates a new subscription.
 * https://developers.swell.is/backend-api/subscription-plans/create-a-subscription-plan
 *
 * @param {string | undefined} swellAccountID - The ID of the Swell account.
 * @param {CartItem[]} cartItems - An array of product IDs along with their quantities.
 * @returns {Promise<Subscription[]>} The subscription details with the default billing set to weekly.
 * @throws An error if the Swell API returns errors.
 */
export const getOrCreateSubscription = async (
  swellAccountID: string | undefined,
  cartItems: CartItem[],
): Promise<Subscription[]> => {
  const subscriptionsResp = await swell.get("/subscriptions", {
    account_id: swellAccountID,
  });

  if (subscriptionsResp === null || subscriptionsResp.results.length === 0) {
    // Swell requires the first product to be a subscription product. The rest of the products are added as invoice items.
    const [firstProduct, ...additionalProducts] = cartItems;

    const invoiceItems = additionalProducts.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      recurring: true,
    }));

    const response = await swell.post("/subscriptions", {
      account_id: swellAccountID,
      product_id: firstProduct?.id,
      quantity: firstProduct?.quantity,
      draft: false,
      items: invoiceItems,
      billing_schedule: { interval: "weekly" },
    });

    if (response.errors) {
      throw new Error(JSON.stringify({ errors: response.errors }));
    }

    return [response];
  } else if (subscriptionsResp.errors) {
    throw new Error(JSON.stringify({ errors: subscriptionsResp.errors }));
  }

  return subscriptionsResp.results;
};
