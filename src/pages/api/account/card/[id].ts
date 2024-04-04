import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellAccountCardUpdateSchema } from "src/schemas/zod/swell";

// Get all cards for an account
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

// Updates an existing account card
export const PUT: APIRoute = async ({ request }) => {
  try {
    const accountCardUpdateJSON = SwellAccountCardUpdateSchema.parse(
      await request.json(),
    );

    const updatedAccountCard = await swell.put(
      `/accounts:cards/${accountCardUpdateJSON.id}`,
      accountCardUpdateJSON,
    );

    if (updatedAccountCard.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to update account card",
          errors: updatedAccountCard.errors,
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
        message: "Account card updated successfully",
        result: updatedAccountCard,
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
