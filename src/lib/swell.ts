import swell from "swell-js";

function initSwell(storeId: string, publicKey: string) {
  swell.init(storeId, publicKey);
  return swell;
}

export { initSwell };
