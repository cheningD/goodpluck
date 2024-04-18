import { swell } from "..";
import type { Subscription } from "swell-js";
import { SwellSubscriptionCreateSchema } from "src/schemas/zod/swell";

/**
 * Get or create a subscription for the Swell account.
 * Attempts to get the subscription for the account, and if none exist, creates a new subscription.
 * https://developers.swell.is/backend-api/subscription-plans/create-a-subscription-plan
 *
 * @param {string | undefined} swellAccountID - The ID of the Swell account.
 * @returns {Promise<Subscription[]>} The subscription details with the default billing set to weekly.
 */
export const getOrCreateSubscription = async (
  swellAccountID: string | undefined,
): Promise<Subscription[]> => {
  const subscriptionsResp = await swell.get("/subscriptions", {
    account_id: swellAccountID,
  });

  // If no subscriptions exist, create a new subscription
  if (subscriptionsResp === null || subscriptionsResp.results.length === 0) {
    const validatedSubscription = SwellSubscriptionCreateSchema.parse({
      account_id: swellAccountID,
    });

    const gpMembershipProduct = await swell.get("/products", {
      slug: "goodpluck-membership",
    });

    const response = await swell.post("/subscriptions", {
      account_id: validatedSubscription.account_id,
      product_id: gpMembershipProduct.results[0].id,
      draft: false,
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
