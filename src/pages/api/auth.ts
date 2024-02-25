import type { APIRoute } from "astro";
import { isLoggedIn } from "@src/lib/stytch";

export const GET: APIRoute = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return new Response(JSON.stringify({ message: "User is not logged in" }), {
      status: 401,
    });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("=")),
  );
  const sessionToken = cookies.gp_session_token;
  if (!sessionToken) {
    return new Response(JSON.stringify({ message: "User is not logged in" }), {
      status: 401,
    });
  }

  const authResp = await isLoggedIn(sessionToken);
  if (authResp && authResp.status_code >= 200 && authResp.status_code < 300) {
    return new Response(
      JSON.stringify({
        message: "User is logged in",
        session: authResp.session,
      }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ message: "User is not logged in" }), {
    status: 401,
  });
};
