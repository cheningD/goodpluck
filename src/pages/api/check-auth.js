import { stytch } from "../../lib/stytch"

export async function GET({ request }) {
  try {
    const cookies = request.headers.get("cookie")
    const sessionToken = parseCookie(cookies, "gp_session_token")

    if (!sessionToken) {
      return new Response(JSON.stringify({ loggedIn: false }), {
        status: 401,
        headers: commonHeaders,
      })
    }

    const resp = await stytch.sessions.authenticate({
      session_token: sessionToken,
    })

    return new Response(
      JSON.stringify({ loggedIn: resp.status_code === 200 }),
      {
        status: 200,
        headers: commonHeaders,
      }
    )
  } catch (err) {
    console.error("Authentication error:", err)

    return new Response(
      JSON.stringify({ loggedIn: false, error: "An error occurred" }),
      {
        status: 500,
        headers: commonHeaders,
      }
    )
  }
}

function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return null
  const value = `; ${cookieHeader}`
  const parts = value.split(`; ${name}=`)
  return parts.length === 2 ? parts.pop().split(";").shift() : null
}

const commonHeaders = {
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'self';",
}
