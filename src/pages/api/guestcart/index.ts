import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";

// Create new guest cart
// Todo: does this need to be secured from abuse?
export const GET: APIRoute = async () => {
  const cart = await swell.post("/carts", {});
  return new Response(JSON.stringify(cart), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
