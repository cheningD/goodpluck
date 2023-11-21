import * as stytch from "stytch";

let stytchClientInstance: stytch.Client | null = null; // Singleton

export const getStytchClient = (runtime: any) => {
  if (!stytchClientInstance) {
    const { STYTCH_PROJECT_ID, STYTCH_PROJECT_SECRET } = runtime.env;

    if (!STYTCH_PROJECT_ID) {
      throw new Error("Missing STYTCH_PROJECT_ID env var");
    }

    if (!STYTCH_PROJECT_SECRET) {
      throw new Error("Missing STYTCH_PROJECT_SECRET env var");
    }

    stytchClientInstance = new stytch.Client({
      project_id: STYTCH_PROJECT_ID,
      secret: STYTCH_PROJECT_SECRET,
    });

    // Stytch is currently broken in Cloudflare runtime so we use this patch
    /* eslint-disable */
    const cl = <any>stytchClientInstance;
    /* eslint-enable */
    cl.fetchConfig.cache = undefined;
  }

  return stytchClientInstance;
};

export const isLoggedIn = async (session_token: string, runtime: any) => {
  if (session_token) {
    try {
      const stytchclient = getStytchClient(runtime);
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