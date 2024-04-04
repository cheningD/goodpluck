import type { APIRoute } from "astro";
import { swell } from "src/lib/swell";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { SwellAccountCreateSchema } from "src/schemas/zod/swell";

export const POST: APIRoute = async ({ request }) => {
  try {
    const validatedAccountData = SwellAccountCreateSchema.parse(
      await request.json(),
    );
    const account = await swell.post("/accounts", {
      email: validatedAccountData.email,
      first_name: validatedAccountData.first_name,
      last_name: validatedAccountData.last_name,
      phone: validatedAccountData.phone,
      email_optin: validatedAccountData.email_optin,
      type: "individual",
      shipping: {
        address1: validatedAccountData.shipping?.address1,
        address2: validatedAccountData.shipping?.address2,
        city: validatedAccountData.shipping?.city,
        state: validatedAccountData.shipping?.state,
        zip: validatedAccountData.shipping?.zip,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Account successfully created",
        account,
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
