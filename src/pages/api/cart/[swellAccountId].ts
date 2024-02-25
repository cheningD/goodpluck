import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";

// Todo: this needs to be authenticated and args validated
export const POST: APIRoute = async ({ request }) => {
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
          result: updatedCart.errors,
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
    return new Response(error.toString(), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const GET: APIRoute = async ({ params }) => {
  const { swellAccountId } = params;
  return new Response(
    JSON.stringify({
      message: `Hello ${swellAccountId} <--`,
    }),
  );
};
