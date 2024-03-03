import { isLoggedIn, stytch } from "@src/lib/stytch";
import type { APIRoute } from "astro";
import { swell } from "@src/lib/swell";

async function getSessionToken(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("=")),
  );
  return cookies.gp_session_token || null;
}

async function getAuthResponse(
  sessionToken: string | null,
): Promise<any | null> {
  if (!sessionToken) {
    return null;
  }

  const authResp = await isLoggedIn(sessionToken);
  return authResp && authResp.status_code >= 200 && authResp.status_code < 300
    ? authResp
    : null;
}

export const isAuthenticated = async (request: Request): Promise<boolean> => {
  const authResp = await getAuthResponse(await getSessionToken(request));
  return !!authResp;
};

export const getLoggedInSwellAccountID = async (
  request: Request,
): Promise<string | null> => {
  const authResp = await getAuthResponse(await getSessionToken(request));
  return authResp ? authResp.user.trusted_metadata?.swell_id || null : null;
};

export const GET: APIRoute = async ({ request }) => {
  const authResp = await getAuthResponse(await getSessionToken(request));

  if (authResp) {
    return new Response(
      JSON.stringify({
        message: "User is logged in",
        session: authResp.session,
        user: authResp.user,
      }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ message: "User is not logged in" }), {
    status: 401,
  });
};

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
        accountId: account.id,
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

export const PUT: APIRoute = async ({ request }) => {
  const authResp = await getAuthResponse(await getSessionToken(request));

  if (!authResp) {
    return new Response(JSON.stringify({ message: "User is not logged in" }), {
      status: 401,
    });
  }

  const { swellAccountId } = await request.json();

  if (!swellAccountId) {
    return new Response(JSON.stringify({ message: "Account ID is required" }), {
      status: 400,
    });
  }

  try {
    await stytch.users.update({
      user_id: authResp.user.user_id,
      trusted_metadata: { swell_account_id: swellAccountId },
    });

    return new Response(
      JSON.stringify({
        message: "User's swell account ID updated successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Failed to update user's swell account ID",
        error,
      }),
      { status: 500 },
    );
  }
};
