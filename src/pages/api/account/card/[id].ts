import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const cards = await swell.get(`/accounts:cards`, {
      parent_id: id,
    });

    if (cards === null || cards.results.length === 0) {
      return new Response(JSON.stringify({ message: "No card found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(cards.results), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : error,
      }),
      {
        status: 500,
      },
    );
  }
};
