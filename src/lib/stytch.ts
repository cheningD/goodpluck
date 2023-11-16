import * as stytch from "stytch";

function getEnvVariable(name: string): string {
  const value = process.env[name] ?? import.meta.env?.[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const stytchProjectId = getEnvVariable("STYTCH_PROJECT_ID");
const stytchProjectSecret = getEnvVariable("STYTCH_PROJECT_SECRET");

const client = new stytch.Client({
  project_id: stytchProjectId,
  secret: stytchProjectSecret,
});

// Stytch patch for Cloudflare runtime (if still necessary)
/* eslint-disable */
const cl = <any>client;
/* eslint-enable */
cl.fetchConfig.cache = undefined;

export const stytchclient = client;