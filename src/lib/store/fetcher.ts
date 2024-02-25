// store/fetcher.ts
import { nanoquery } from "@nanostores/query";

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: Array<string | number | boolean>) => {
    const r = await fetch(keys.join(""));
    return await r.json();
  },
});
