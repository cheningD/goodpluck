import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { SwellAccountCardSchema } from "src/schemas/zod/swell";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const POST: APIRoute = async ({ request }) => {
  try {
    const validatedAccountData = SwellAccountCardSchema.parse(
      await request.json(),
    );
    const accountId = validatedAccountData.parent_id;
    const account = await swell.get(`/accounts/${accountId}`);
    const card = await swell.post(`/accounts:cards`, {
      parent_id: accountId,
      token: validatedAccountData.token,
      billing: validatedAccountData.billing
        ? validatedAccountData.billing
        : account.shipping,
    });
    await swell.put(`/accounts/${accountId}`, {
      billing: {
        account_card_id: card.id,
      },
    });

    return new Response(
      JSON.stringify({
        cardId: card.id,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: fromZodError(error).toString(),
        }),
        {
          status: 400,
        },
      );
    }
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
