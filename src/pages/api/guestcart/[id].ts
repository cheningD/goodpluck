import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";

// Retrieve existing guest cart
// Todo: if the ID is not found, we should create a new cart
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const cart = await swell.get(`/carts/${id}`, { id });
  if (cart?.id && cart.id === id) {
    return new Response(JSON.stringify(cart), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ message: "Cart not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
