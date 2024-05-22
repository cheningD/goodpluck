import type { SessionsAuthenticateResponse, UsersUpdateRequest } from "stytch";
import { isLoggedIn, stytch } from "src/lib/stytch";

import type { APIRoute } from "astro";
import { updateStytchUserSchema } from "src/schemas/zod/stytch";

export const getSessionToken = async (
  request: Request,
): Promise<string | null> => {
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
  sessionToken: string,
): Promise<string | undefined> => {
  const authResp = await getAuthResponse(sessionToken);
  return authResp?.user.trusted_metadata?.swell_account_id;
};

export const GET: APIRoute = async ({ request }) => {
  const authResp = await getAuthResponse(await getSessionToken(request));

  if (authResp) {
    return new Response(
      JSON.stringify({
        message: "User is logged in",
        isLoggedInStytch: true,
        session: authResp.session,
        user: authResp.user,
      }),
      { status: 200 },
    );
  }

  return new Response(
    JSON.stringify({
      message: "User is not logged in",
      isLoggedInStytch: false,
    }),
    {
      status: 401,
    },
  );
};

export const PUT: APIRoute = async ({ request }) => {
  const authResp = await getAuthResponse(await getSessionToken(request));

  if (!authResp) {
    return new Response(JSON.stringify({ message: "User is not logged in" }), {
      status: 401,
    });
  }

  const updateData = updateStytchUserSchema.parse(
    await request.json(),
  ) as Partial<UsersUpdateRequest>;

  // Retrieve the current user data from Stytch
  const currentUserResp = await stytch.users.get({
    user_id: authResp.user.user_id,
  });
  if (currentUserResp.status_code < 200 || currentUserResp.status_code >= 300) {
    return new Response(
      JSON.stringify({
        message: "Failed to retrieve current user data",
        error: currentUserResp,
      }),
      { status: 500 },
    );
  }

  // Merge update data with existing metadata
  if (updateData.trusted_metadata) {
    updateData.trusted_metadata = {
      ...currentUserResp.trusted_metadata,
      ...updateData.trusted_metadata,
    };
  }
  if (updateData.untrusted_metadata) {
    updateData.untrusted_metadata = {
      ...currentUserResp.untrusted_metadata,
      ...updateData.untrusted_metadata,
    };
  }

  // Update the user data
  const updateAccountResp = await stytch.users.update({
    user_id: authResp.user.user_id,
    ...updateData,
  });

  if (
    updateAccountResp.status_code < 200 ||
    updateAccountResp.status_code >= 300
  ) {
    return new Response(
      JSON.stringify({
        message: "Failed to update user",
        error: updateAccountResp,
      }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({
      message: "User updated successfully",
    }),
    { status: 200 },
  );
};
