import { isLoggedIn } from "@src/lib/stytch";
import type { APIRoute } from "astro";

export const isAuthenticated = async (request: Request): Promise<boolean> => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return false;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("=")),
  );
  const sessionToken = cookies.gp_session_token;
  if (!sessionToken) {
    return false;
  }

  const authResp = await isLoggedIn(sessionToken);
  if (!authResp) {
    return false;
  }
  return authResp && authResp.status_code >= 200 && authResp.status_code < 300;
};

export const getLoggedInSwellAccountID = async (
  request: Request,
): Promise<string | null> => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("=")),
  );
  const sessionToken = cookies.gp_session_token;
  if (!sessionToken) {
    return null;
  }

  const authResp = await isLoggedIn(sessionToken);
  if (!authResp) {
    return null;
  }
  if (authResp && authResp.status_code >= 200 && authResp.status_code < 300) {
    return (authResp.user.trusted_metadata?.swell_id as string) || null;
  }
  return null;
};

export const GET: APIRoute = async ({ request }) => {
  const isLoggedInUser = await isAuthenticated(request);

  if (isLoggedInUser) {
    return new Response(JSON.stringify({ message: "User is logged in" }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: "User is not logged in" }), {
    status: 401,
  });
};
