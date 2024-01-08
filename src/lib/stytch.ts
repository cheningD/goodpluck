import * as stytchpkg from "stytch";

export const stytch = new stytchpkg.Client({
  project_id: import.meta.env.STYTCH_PROJECT_ID,
  secret: import.meta.env.STYTCH_PROJECT_SECRET,
});

export const isLoggedIn = async (
  sessionToken: string,
): Promise<stytchpkg.SessionsAuthenticateResponse | null> => {
  if (sessionToken) {
    try {
      const session = await stytch.sessions.authenticate({
        session_token: sessionToken,
      });
      return session; // Session is valid
    } catch (e) {
      if (e instanceof Error) {
        console.error("Session token invalid:", e.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }
  return null; // No valid session token found
};
