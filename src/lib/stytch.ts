import * as stytch from "stytch";

if (!process.env.STYTCH_PROJECT_ID) {
  throw new Error("Missing STYTCH_PROJECT_ID env var");
}

if (!process.env.STYTCH_PROJECT_SECRET) {
  throw new Error("Missing STYTCH_PROJECT_SECRET env var");
}

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_PROJECT_SECRET,
});

// Stytch is currently broken in cloudflare runtime so we use this patch
/* eslint-disable */
const cl = <any>client;
/* eslint-enable */
cl.fetchConfig.cache = undefined;

export const stytchclient = client;

export const isLoggedIn = async (session_token: string) => {
  if (session_token) {
    try {
      // Verify the session token with Stytch
      await stytchclient.sessions.authenticate({ session_token });
      return true; // Session is valid
    } catch (e) {
      if (e instanceof Error) {
        console.error("Session token invalid:", e.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }
  return false; // No valid session token found
};