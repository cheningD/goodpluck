import { swell } from "..";
import type { Subscription } from "swell-js";
import { SwellSubscriptionCreateSchema } from "src/schemas/zod/swell";
import { GP_MEMBERSHIP_PRODUCT_ID } from "src/lib/constants";

/**
 * Retrieves or creates a single membership subscription for a Swell account to track the user's overall membership status.
 * If no subscription exists, a new one is created with weekly billing.
 * Ref: https://developers.swell.is/backend-api/subscription-plans/create-a-subscription-plan
 *
 * @param {string | undefined} swellAccountID - The ID of the Swell account.
 * @returns {Promise<Subscription>} The Swell subscription object.
 */
export const getOrCreateMembershipSubscription = async (
  swellAccountID: string | undefined,
): Promise<Subscription> => {
  try {
    const subscriptionsResp = await swell.get("/subscriptions", {
      account_id: swellAccountID,
    });

    // If no subscriptions exist, create a new one
    if (subscriptionsResp === null || subscriptionsResp.results.length === 0) {
      const validatedSubscription = SwellSubscriptionCreateSchema.parse({
        account_id: swellAccountID,
      });

      // A draft subscription is created to avoid immediate billing
      const response = await swell.post("/subscriptions", {
        draft: true,
        account_id: validatedSubscription.account_id,
        product_id: GP_MEMBERSHIP_PRODUCT_ID,
        billing_schedule: {
          interval: "weekly",
          interval_count: 1,
        },
        interval: "weekly",
        interval_count: 1,
      });

      if (response.errors) {
        throw new Error(JSON.stringify({ errors: response.errors }));
      }

      return response;
    } else if (subscriptionsResp.errors) {
      throw new Error(JSON.stringify({ errors: subscriptionsResp.errors }));
    }

    return subscriptionsResp.results[0];
  } catch (error) {
    throw new Error(
      JSON.stringify({
        errors:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
    );
  }
};
