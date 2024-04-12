import type { APIRoute } from "astro";
import { getOrCreateSubscription } from "src/lib/swell/subscription";
import { getLoggedInSwellAccountID, getSessionToken } from "../auth";
import { getOrCreateCarts } from "src/lib/swell/cart";

export const GET: APIRoute = async ({ request }) => {
  try {
    const sessionToken = await getSessionToken(request);
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ message: "No session token found" }),
        { status: 401 },
      );
    }

    const swellAccountID = await getLoggedInSwellAccountID(sessionToken);
    const carts = await getOrCreateCarts(swellAccountID);
    const cart = carts[0];
    const cartItems = cart?.items?.map((item) => ({
      id: item.product_id,
      quantity: item.quantity,
    }));

    if (!cartItems) {
      return new Response(
        JSON.stringify({ message: "No account or cart found" }),
        { status: 404 },
      );
    }

    const response = await getOrCreateSubscription(swellAccountID, cartItems);
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
};
