// eslint-disable-next-line @typescript-eslint/no-var-requires
const swell = require("swell-node").init(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.SWELL_SECRET_KEY,
);

export { swell };
