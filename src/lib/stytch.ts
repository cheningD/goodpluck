import * as stytch from "stytch";

export const createStytchClient = (runtimeEnv: any) => {
  const projectId = runtimeEnv.STYTCH_PROJECT_ID;
  const projectSecret = runtimeEnv.STYTCH_PROJECT_SECRET;

  if (!projectId) {
    throw new Error("Missing STYTCH_PROJECT_ID env var");
  }
  if (!projectSecret) {
    throw new Error("Missing STYTCH_PROJECT_SECRET env var");
  }

  const client = new stytch.Client({
    project_id: projectId,
    secret: projectSecret,
  });

  // Stytch is currently broken in cloudflare runtime so we use this patch
  /* eslint-disable */
  const cl = <any>client;
  /* eslint-enable */
  cl.fetchConfig.cache = undefined;

  return client;
};

export const isLoggedIn = async (runtimeEnv: any, session_token: string) => {
  if (session_token) {
    try {
      // Verify the session token with Stytch
      const stytchclient = createStytchClient(runtimeEnv);
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

// Validate OTP code

// Send OTP code

// Revoke session