import swellnode from "swell-node";
import type { GoodpluckCategory } from "../types";

export const swell = swellnode.init(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.SWELL_SECRET_KEY,
);

// Only get categories that contain products
export const getCategories = async (
  limit: number = 50,
  page: number = 1,
): Promise<GoodpluckCategory[]> => {
  const resp = await swell.get("/categories", {
    limit,
    page,
    sort: "order asc",
    expand: "products:1", // Return no more than 1 product
    fields: "name,slug,parent_id,products,sort,top_id",
  });

  // Filter out categories with no products
  const categories = getObjectsWithProductsAndAncestors(resp.results);
  categories.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  return categories;
};
const getObjectsWithProductsAndAncestors = (
  categories: GoodpluckCategory[],
): GoodpluckCategory[] => {
  // Create a Map for fast lookup of categories by their id
  const map = new Map(categories.map((category) => [category.id, category]));

  // Use a Set to store the result and avoid duplicates
  const result = new Set<GoodpluckCategory>();

  // Recursive function to get all ancestors of a category
  const getAncestors = (id: string): void => {
    // Get the category object by its id
    const category = map.get(id);

    if (category) {
      // Add the category to the result set
      result.add(category);

      // If the category has a parent_id, recursively call getAncestors for the parent category
      if (category.parent_id) {
        getAncestors(category.parent_id);
      }
    }
  };

  // For each category in the input array, check if it has products
  categories.forEach((category) => {
    if (category.products.count > 0) {
      // If the category has products, call getAncestors to find its ancestors
      getAncestors(category.id);
    }
  });

  // Convert the Set back to an array and return the result
  return Array.from(result);
};
