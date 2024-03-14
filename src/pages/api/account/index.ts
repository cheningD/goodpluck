import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { SwellAccountSchema } from "@src/schemas/zod";

export const POST: APIRoute = async ({ request }) => {
  try {
    const validatedAccountData = SwellAccountSchema.parse(await request.json());
    const account = await swell.post("/accounts", {
      email: validatedAccountData.email,
      first_name: validatedAccountData.firstName,
      last_name: validatedAccountData.lastName,
      phone: validatedAccountData.phone,
      email_optin: validatedAccountData.consent,
      type: "individual",
      shipping: {
        address1: validatedAccountData.address,
        address2: validatedAccountData.apartment,
        city: validatedAccountData.city,
        state: validatedAccountData.state,
        zip: validatedAccountData.zip,
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
