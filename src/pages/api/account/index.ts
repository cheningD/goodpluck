import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";

// create a swell account
export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      apartment,
      city,
      state,
      zip,
      consent,
    } = await request.json();

    const account = await swell.post("/accounts", {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      email_optin: consent,
      type: "individual",
      shipping: { address1: address, address2: apartment, city, state, zip },
    });

    return new Response(
      JSON.stringify({
        message: "Account successfully created",
        account,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Account creation failed", error }),
      { status: 500 },
    );
  }
};
