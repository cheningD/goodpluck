import swellnode from "swell-node";
import { type Category } from "swell-js";

const swell = swellnode.init(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.SWELL_SECRET_KEY,
);

const getCategories = async (
  limit: number = 50,
  page: number = 1,
): Promise<Category[]> => {
  const resp = await swell.get("/categories", {
    where: {
      active: true,
    },
    limit,
    page,
    sort: "order asc",
  });

  return resp.results as Category[];
};

export { swell, getCategories };
