import swell from "swell-js";

swell.init(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
);

export { swell };
