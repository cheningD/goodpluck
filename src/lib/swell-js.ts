import swell from "swell-js";

function initSwell(storeId: string, publicKey: string): any {
  swell.init(storeId, publicKey);
  return swell;
}

export { initSwell };
