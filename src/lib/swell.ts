import swell from "swell-js";

// Initialize Swell, Access the envirnoment variables from the runtime
// https://docs.astro.build/en/guides/integrations-guide/cloudflare/#cloudflare-runtime
export default function initSwell(storeId: string, publicKey: string) {
  swell.init(storeId, publicKey);
  return swell;
}
