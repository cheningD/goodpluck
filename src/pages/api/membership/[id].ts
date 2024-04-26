import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellSubscriptionUpdateSchema } from "src/schemas/zod/swell";

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const validatedData = SwellSubscriptionUpdateSchema.parse(
      await request.json(),
    );

    // When the items array is empty, set it to null to clear one-time items in the subscription.
    const items = validatedData.items;
    if (items && !items.length) {
      validatedData.items = null;
    }

    const resp = await swell.put(`/subscriptions/${id}`, validatedData);

    if (resp.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to update subscription",
          errors: resp.errors,
        }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify(resp), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
};
