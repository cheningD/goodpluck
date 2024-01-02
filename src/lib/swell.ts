import swell from "swell-js";

// Initialize Swell, Access the envirnoment variables from the runtime
// https://docs.astro.build/en/guides/integrations-guide/cloudflare/#cloudflare-runtime
let swellInstance: typeof swell | null = null; // Singleton

const getSwellClient = (storeId: string, publicKey: string): typeof swell => {
  if (!swellInstance) {
    swell.init(storeId, publicKey);
    swellInstance = swell;
  }
  return swellInstance;
};

export { getSwellClient };
