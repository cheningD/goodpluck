import type { APIRoute } from "astro";
import { getOrCreateSubscription } from "src/lib/swell/subscription";

export const GET: APIRoute = async ({ params }) => {
  try {
    const response = await getOrCreateSubscription(params.id);
    return new Response(JSON.stringify(response), {
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
