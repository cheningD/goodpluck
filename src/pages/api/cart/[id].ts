import { getLoggedInSwellAccountID, getSessionToken } from "../auth";

import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellCartUpdateSchema } from "src/schemas/zod/swell";
import { format, differenceInDays, isPast } from "date-fns";
import { mergeCartItems } from "src/lib/swell/cart";
import type { GoodpluckCart } from "src/lib/types";

export const PUT: APIRoute = async ({ request }) => {
  try {
    const cartUpdateJSON = SwellCartUpdateSchema.parse(await request.json());
    const { delivery_date: deliveryDate, id } = cartUpdateJSON;

    // Get user authentication information
    const sessionToken = await getSessionToken(request);
    const swellAccountID = sessionToken
      ? await getLoggedInSwellAccountID(sessionToken)
      : null;

    const cart = await swell.get(`/carts/${id}`);

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the user is authorized to update the cart
    const isLoggedInUserAuthorized =
      swellAccountID && cart.account_id === swellAccountID;
    const isGuestUserAuthorized = !swellAccountID && !cart.account_id;

    if (!isLoggedInUserAuthorized && !isGuestUserAuthorized) {
      return new Response(
        JSON.stringify({ message: "Unauthorized to update this cart" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate delivery date if provided
    if (deliveryDate) {
      const windowEnd = new Date(cart.ordering_window_end_date);
      const windowStart = new Date(cart.ordering_window_start_date);
      const newDeliveryDate = new Date(deliveryDate);

      // Cart edit window needs to be open to update the delivery date
      if (isPast(windowEnd)) {
        return new Response(
          JSON.stringify({
            message: `Cart edit window closed ${format(windowEnd, "MM-dd-yyyy")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Delivery date must be within or on the 7th day from the cart order window start date.
      // This is because cart order windows open on Monday and at most can be delivered the following Monday.
      if (differenceInDays(newDeliveryDate, windowStart) >= 7) {
        return new Response(
          JSON.stringify({
            message: `Delivery date must be within 7 days of ${format(windowStart, "MM-dd-yyyy")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const updatedCart = await swell.put(`/carts/${id}`, cartUpdateJSON);

    if (updatedCart.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to update cart",
          errors: updatedCart.errors,
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
        message: "Cart updated successfully",
        result: updatedCart,
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

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  try {
    const cart = await swell.get(`/carts/${id}`, {
      id,
      expand: ["items.product", "items.product.vendor"],
    });

    if (!cart || cart?.errors) {
      return new Response(
        JSON.stringify({ error: cart?.errors || "Cart not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // If `ignorePastCarts=true` and cart edit is past, return a 404
    if (
      new URL(request.url).searchParams.get("ignorePastCarts") === "true" &&
      isPast(new Date(cart.ordering_window_end_date))
    ) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const sessionToken = await getSessionToken(request);
    const swellAccountID = sessionToken
      ? await getLoggedInSwellAccountID(sessionToken)
      : null;

    if (swellAccountID) {
      return await handleAuthenticatedCart(cart, swellAccountID);
    } else if (!cart.account_id) {
      // Guest user requests a guest cart
      return new Response(JSON.stringify(cart), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Cart not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

/**
 * Handles authenticated user carts by either returning the existing user cart,
 * assigning a guest cart to the user, or merging the guest cart with the user's cart.
 *
 * @param cart - The Goodpluck cart object.
 * @param swellAccountID - The authenticated user's Swell account ID.
 * @returns A promise that resolves to a Response object containing the Goodpluck cart data.
 */
const handleAuthenticatedCart = async (
  cart: GoodpluckCart,
  swellAccountID: string,
): Promise<Response> => {
  const userCartResponse = await swell.get("/carts", {
    account_id: swellAccountID,
  });
  const userCart = userCartResponse.results[0];

  if (cart.account_id === swellAccountID) {
    // Authenticated user owns the cart
    return new Response(JSON.stringify(cart), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (!cart.account_id) {
    if (!userCart) {
      // No user cart exists, assign the guest cart to the authenticated user
      const updatedCart = await swell.put(`/carts/${cart.id}`, {
        account_id: swellAccountID,
      });
      return new Response(JSON.stringify(updatedCart), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Merge guest cart with user's existing cart
      const mergedCart = await mergeCartItems(userCart, cart);
      await swell.delete(`/carts/${cart.id}`);
      return new Response(JSON.stringify(mergedCart), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ message: "Cart not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
