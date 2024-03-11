import { isLoggedIn, stytch } from "@src/lib/stytch";
import type { SessionsAuthenticateResponse } from "stytch";
import type { APIRoute } from "astro";

const getSessionToken = async (request: Request): Promise<string | null> => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("=")),
  );
  return cookies.gp_session_token || null;
};

const getAuthResponse = async (
  sessionToken: string | null,
): Promise<SessionsAuthenticateResponse | null> => {
  if (!sessionToken) {
    return null;
  }

  const authResp = await isLoggedIn(sessionToken);
  return authResp && authResp.status_code >= 200 && authResp.status_code < 300
    ? authResp
    : null;
};

export const isAuthenticated = async (request: Request): Promise<boolean> => {
  const authResp = await getAuthResponse(await getSessionToken(request));
  return !!authResp;
};

export const getLoggedInSwellAccountID = async (
  request: Request,
): Promise<string | null> => {
  const authResp = await getAuthResponse(await getSessionToken(request));
  return authResp
    ? authResp.user.trusted_metadata?.swell_account_id || null
    : null;
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

  const updateAccountResp = await stytch.users.update({
    user_id: authResp.user.user_id,
    trusted_metadata: { swell_account_id: swellAccountId },
  });

  if (
    updateAccountResp.status_code < 200 ||
    updateAccountResp.status_code >= 300
  ) {
    return new Response(
      JSON.stringify({
        message: "Failed to update user's swell account ID",
        error: updateAccountResp,
      }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({
      message: "User's swell account ID updated successfully",
    }),
    { status: 200 },
  );
};
