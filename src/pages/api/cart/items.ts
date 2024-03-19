import { getLoggedInSwellAccountID, getSessionToken } from "../auth";

import type { APIRoute } from "astro";
import { SwellEditCartItemsSchema } from "@src/schemas/zod/swell";
import { swell } from "@src/lib/swell";

// Todo if you are logged in make sure this is your cart
// Todo if you are not logged in, make sure this cart is a guest cart
// PUT will overwrite the items array with whatever you give it thanks to the $set directive
export const PUT: APIRoute = async ({ request }) => {
  const { cartId, items } = SwellEditCartItemsSchema.parse(
    await request.json(),
  );
  let swellAccountId = null;
  const sessionToken = await getSessionToken(request);
  if (sessionToken) {
    swellAccountId = getLoggedInSwellAccountID(sessionToken);
  }
  const guest = !swellAccountId;
  const where: Record<string, any> = { guest };
  if (swellAccountId) {
    where.account_id = swellAccountId;
  }
  try {
    const cart = await swell.put(`/carts/${cartId}`, {
      id: cartId,
      $set: { items },
      where,
    });
    if (cart.errors) {
      return new Response(JSON.stringify({ error: cart.errors }), {
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({
        message: "Cart updated successfully",
        result: cart,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
