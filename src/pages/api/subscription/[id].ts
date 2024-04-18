import type { APIRoute } from "astro";
import { getOrCreateSubscription } from "src/lib/swell/subscription";
import { swell } from "src/lib/swell";
import { SwellSubscriptionUpdateSchema } from "src/schemas/zod/swell";

export const GET: APIRoute = async ({ params }) => {
  try {
    const response = await getOrCreateSubscription(params.id);
    return new Response(JSON.stringify(response[0]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const status = message.startsWith("No")
      ? message.endsWith("found")
        ? 404
        : 401
      : 500;
    return new Response(JSON.stringify({ message }), { status });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const validatedData = SwellSubscriptionUpdateSchema.parse(
      await request.json(),
    );

    const items = validatedData.items;

    const resp = await swell.put(`/subscriptions/${id}`, {
      items: items.length ? items : null,
    });

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
