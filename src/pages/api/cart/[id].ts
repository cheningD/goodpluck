import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";
import { getLoggedInSwellAccountID } from "../auth";

// Todo: this needs to be authenticated and args validated (https://zod.dev/?id=strict)
// Todo: verify that the cart belongs to the user, if logged in
export const PUT: APIRoute = async ({ request }) => {
  try {
    const cartUpdateJSON = await request.json();

    const updatedCart = await swell.put(
      `/carts/${cartUpdateJSON.id}`,
      cartUpdateJSON,
    );

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
  const swellAccountID = await getLoggedInSwellAccountID(request);

  const { id } = params;
  try {
    const cart = await swell.get(`/carts/${id}`, {
      id,
    });

    if (cart?.errors) {
      return new Response(JSON.stringify({ errors: cart.errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (swellAccountID && cart?.account_id === swellAccountID) {
      // Todo: If logged in, but user is requesting a guest cart, we should merge or replace it with the authenticated cart
      // If logged in, and the cart id matches the account id return the cart
      return new Response(JSON.stringify(cart), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (!swellAccountID && cart?.guest === true) {
      // If not logged in and the cart is a guest cart, return the cart
      return new Response(JSON.stringify(cart), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log(`Cart not found for id: ${id}<----`);

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
