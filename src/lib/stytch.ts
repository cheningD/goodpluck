import * as stytchpkg from "stytch";

export const prerender = false;

const client = new stytchpkg.Client({
  project_id: import.meta.env.STYTCH_PROJECT_ID || `${"VITE_DEFINE_STYTCH_PROJECT_ID"}`,
  secret:
    import.meta.env.STYTCH_PROJECT_SECRET || `${"VITE_DEFINE_STYTCH_PROJECT_SECRET"}`,
});

export const stytch = client;
