import * as stytch from "stytch";

let stytchClientInstance: stytch.Client | null = null; // Singleton

export const getStytchClient = (projectID: string, projectSecret: string) => {
  if (!stytchClientInstance) {
    stytchClientInstance = new stytch.Client({
      project_id: projectID,
      secret: projectSecret,
    });

    // Stytch is currently broken in Cloudflare runtime so we use this patch
    /* eslint-disable */
    const cl = <any>stytchClientInstance;
    /* eslint-enable */
    cl.fetchConfig.cache = undefined;
  }

  return stytchClientInstance;
};

export const isLoggedIn = async (session_token: string, projectID: string, projectSecret: string) => {
  if (session_token) {
    try {
      const stytchclient = getStytchClient(projectID, projectSecret);
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