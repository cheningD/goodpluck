import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellSubscriptionUpdateSchema } from "src/schemas/zod/swell";

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const resp = await swell.get("/subscriptions", { account_id: id });

    if (!resp || resp.errors || !resp.results.length) {
      return new Response(
        JSON.stringify({
          message: resp.errors
            ? "Failed to fetch subscriptions"
            : "No subscriptions found",
          errors: resp.errors,
        }),
        {
          status: resp.errors ? 400 : 404,
        },
      );
    }

    return new Response(JSON.stringify(resp.results[0]), {
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const resp = await swell.delete(`/subscriptions/${id}`);

    if (resp.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to delete subscription",
          errors: resp.errors,
        }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const validatedData = SwellSubscriptionUpdateSchema.parse(
      await request.json(),
    );

    const [firstProduct, ...additionalProducts] = validatedData.items;
    const invoiceItems = additionalProducts.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      recurring: true,
    }));

    const resp = await swell.put(`/subscriptions/${id}`, {
      product_id: firstProduct?.product_id,
      quantity: firstProduct?.quantity,
      items: invoiceItems.length ? invoiceItems : null,
      draft: false,
      billing_schedule: { interval: "weekly" },
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
