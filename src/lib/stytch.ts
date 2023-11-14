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
