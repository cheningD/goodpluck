import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellSubscriptionUpdateSchema } from "src/schemas/zod/swell";

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const membershipUpdateJSON = SwellSubscriptionUpdateSchema.parse(
      await request.json(),
    );

    // When the items array is empty, set it to null to clear one-time items in the subscription.
    const items = membershipUpdateJSON.items;
    if (items && !items.length) {
      membershipUpdateJSON.items = null;
    }

    const updatedMembership = await swell.put(
      `/subscriptions/${id}`,
      membershipUpdateJSON,
    );

    if (updatedMembership.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to update membership",
          errors: updatedMembership.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Membership updated successfully",
        result: updatedMembership,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
