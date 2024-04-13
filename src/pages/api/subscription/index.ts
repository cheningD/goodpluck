import type { APIRoute } from "astro";
import { getOrCreateSubscription } from "src/lib/swell/subscription";
import { getLoggedInSwellAccountID, getSessionToken } from "../auth";
import { getOrCreateCarts } from "src/lib/swell/cart";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get the session token from the request and attempt to get the Swell account ID
    const sessionToken = await getSessionToken(request);
    if (!sessionToken) throw new Error("No session token found");

    const swellAccountID = await getLoggedInSwellAccountID(sessionToken);
    if (!swellAccountID) throw new Error("No Swell account found");

    // Get the cart for the Swell account
    const carts = await getOrCreateCarts(swellAccountID);
    const cart = carts[0];
    if (!cart) throw new Error("No cart found");

    const productItems = cart.items?.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const response = await getOrCreateSubscription(
      swellAccountID,
      productItems,
    );
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
