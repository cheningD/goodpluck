import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellAccountUpdateSchema } from "src/schemas/zod/swell";

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const account = await swell.get(`/accounts/${id}`);
    return new Response(JSON.stringify(account), {
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

export const PUT: APIRoute = async ({ request }) => {
  try {
    const accountUpdateJSON = SwellAccountUpdateSchema.parse(
      await request.json(),
    );

    const updatedAccount = await swell.put(
      `/accounts/${accountUpdateJSON.id}`,
      accountUpdateJSON,
    );

    if (updatedAccount.errors) {
      return new Response(
        JSON.stringify({
          message: "Failed to update account",
          errors: updatedAccount.errors,
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
        message: "Account updated successfully",
        result: updatedAccount,
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
