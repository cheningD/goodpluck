import swellnode from "swell-node";

const swell = swellnode.init(
  import.meta.env.SWELL_STORE_ID,
  import.meta.env.SWELL_SECRET_KEY,
);

export { swell };
