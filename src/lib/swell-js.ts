import swell from "swell-js";

function initSwell(storeId: string, publicKey: any): any {
  swell.init(storeId, publicKey);
  return swell;
}

export { initSwell };
