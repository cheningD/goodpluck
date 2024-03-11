import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";
import { ZodError, z } from "zod";

const SwellAccountSchema = z
  .object({
    email: z.string().email(), // already validated by Stytch when first creating the account (`/join/`)
    firstName: z.number(),
    lastName: z.number(),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
      message: "Please enter a valid phone number, e.g., (555) 555-1234",
    }),
    address: z.string(),
    apartment: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, {
      message: "Invalid ZIP code, e.g., 12345 or 12345-6789",
    }),
    consent: z.boolean(),
  })
  .strict();

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
    const status = error instanceof ZodError ? 400 : 500;
    const message =
      error instanceof ZodError
        ? "Validation error: " + error.message
        : "Account creation failed";

    return new Response(
      JSON.stringify({
        message,
        error: error instanceof ZodError ? undefined : error,
      }),
      {
        status,
      },
    );
  }
};
