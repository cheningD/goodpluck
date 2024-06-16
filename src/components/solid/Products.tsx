import type { GoodpluckCategory, GoodpluckProduct } from "src/lib/types";
import {
  For,
  type Component,
  createSignal,
  onMount,
  Show,
  createMemo,
} from "solid-js";
import Fuse from "fuse.js";
import Product from "./Product";
import { SearchBar } from "./SearchBar";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { $activeCategorySlug } from "src/lib/store";

interface IProps {
  activeCategorySlug?: string;
  categories: GoodpluckCategory[];
  productMap: Map<string, GoodpluckProduct>;
}

interface FilteredCategory {
  name: string;
  slug: string;
  products: GoodpluckProduct[];
}

// Observe the categories to select the active category
// https://primitives.solidjs.community/package/intersection-observer
const setActiveCategory = (): void => {
  const categoryElements = Array.from(
    document.querySelectorAll("#category-products > div[id^='category-']"),
  );

  createIntersectionObserver(
    () => categoryElements,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child) => {
            const categorySlug = child.getAttribute("data-slug");
            if (categorySlug) {
              $activeCategorySlug.set(categorySlug);
            }
          });
        }
      });
    },
    { threshold: 0.5 }, // Trigger when 50% of the element is visible
  );
};

const Products: Component<IProps> = ({
  activeCategorySlug,
  categories,
  productMap,
}) => {
  const [searchTerm, setSearchTerm] = createSignal("");

  onMount(() => {
    if (activeCategorySlug) {
      // Scroll to the active category
      const target = document.querySelector(`#${activeCategorySlug}`);
      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 170; // Adjust the offset value (170) based on your navbar's height
        window.scrollTo({ top: offset, behavior: "smooth" });
      }

      setActiveCategory();
    }
  });

  const fuse = createMemo(() => {
    const products = categories.flatMap((category) =>
      category.products.results
        .map((p) => productMap.get(p.product_id))
        .filter((product): product is GoodpluckProduct => product !== undefined)
        .map((product) => ({ ...product, category: category.name })),
    );

    return new Fuse(products, {
      includeScore: false,
      threshold: 0.2, // the lower the value, the more accurate the results
      shouldSort: false, // whether to sort the result list by score
      keys: ["name", "category"],
    });
  });

  const getFilteredCategories = createMemo((): FilteredCategory[] => {
    const term = searchTerm().toLowerCase();
    if (!term) {
      return categories.map((category) => ({
        name: category.name,
        slug: category.slug,
        products: category.products.results
          .map((p) => productMap.get(p.product_id))
          .filter(
            (product): product is GoodpluckProduct => product !== undefined,
          ),
      }));
    }

    const results = fuse().search(term);
    const filteredProducts = results.map((result) => result.item);

    const categoryMap = new Map<string, FilteredCategory>();

    filteredProducts.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        const category = categories.find(
          (cat) => cat.name === product.category,
        );
        if (category) {
          categoryMap.set(product.category, {
            name: category.name,
            slug: category.slug,
            products: [],
          });
        }
      }
      categoryMap.get(product.category)?.products.push(product);
    });

    return Array.from(categoryMap.values());
  });

  return (
    <div>
      <SearchBar onSearch={setSearchTerm} />
      <Show
        when={getFilteredCategories().length > 0}
        fallback={
          <div class="text-center my-8">
            <h2 class="text-xl font-semibold">No products found.</h2>
            <p>Try adjusting your search.</p>
          </div>
        }
      >
        <div id="category-products">
          <For each={getFilteredCategories()}>
            {({ name, slug, products }) => (
              <div id={`category-${slug}`} class="my-8">
                <h1
                  id={slug}
                  class="text-2xl font-bold mb-4 scroll-mt-20"
                  data-slug={slug}
                >
                  {name}
                </h1>
                <div
                  id={`${slug}-products`}
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <For each={products}>
                    {(product) => <Product product={product} />}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Products;
