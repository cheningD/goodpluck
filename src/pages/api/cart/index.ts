import { getLoggedInSwellAccountID, getSessionToken } from "../auth";

import type { APIRoute } from "astro";
import { getOrCreateCarts } from "src/lib/swell/cart";

export const GET: APIRoute = async ({ request }) => {
  try {
    let swellAccountID;
    const sessionToken = await getSessionToken(request);
    if (sessionToken) {
      swellAccountID = await getLoggedInSwellAccountID(sessionToken);
    }
    const response = await getOrCreateCarts(swellAccountID);
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(error.message, {
      status: error.message.includes("errors") ? 400 : 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
