import type { APIRoute } from "astro";
import { getOrCreateMembershipSubscription } from "src/lib/swell/membership";
import { getLoggedInSwellAccountID, getSessionToken } from "../auth";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get the session token from the request and attempt to get the Swell account ID
    const sessionToken = await getSessionToken(request);
    if (!sessionToken) throw new Error("No session token found");

    const swellAccountID = await getLoggedInSwellAccountID(sessionToken);
    if (!swellAccountID) throw new Error("No Swell account found");

    const membershipSubscription =
      await getOrCreateMembershipSubscription(swellAccountID);

    return new Response(JSON.stringify(membershipSubscription), {
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

    return new Response(JSON.stringify({ message }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
