export async function GET({ request }) {
  const cookies = request.headers.get("cookie")
  const sessionToken = parseCookie(cookies, "gp_session_token")

  let isLoggedIn = false

  if (sessionToken) {
    isLoggedIn = true
  }

  return new Response(JSON.stringify({ loggedIn: isLoggedIn }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function parseCookie(cookieHeader, name) {
  const value = `; ${cookieHeader}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}
