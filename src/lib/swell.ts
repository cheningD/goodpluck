import swell from "swell-node";

export default swell.init(
  import.meta.env.SWELL_STORE_ID,
  import.meta.env.SWELL_SECRET_KEY
);
