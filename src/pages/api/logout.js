import { stytch } from "../../lib/stytch"

export async function POST({ cookies }) {
  let message = ""
  const sessionToken = cookies.get("gp_session_token")?.value

  if (sessionToken) {
    try {
      await stytch.sessions.revoke({ session_token: sessionToken })
      message = `You have logged out`
      cookies.delete("gp_session_token")
      return new Response(JSON.stringify({ message }), {
        status: 200,
        headers: {
          "Set-Cookie":
            "gp_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
          "Content-Type": "application/json",
        },
      })
    } catch (e) {
      message = "An error occurred during logout."
      return new Response(JSON.stringify({ message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
  } else {
    message = "You are not logged in"
    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
