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

interface IProps {
  currentCategory?: GoodpluckCategory | undefined; // https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes
  categories: GoodpluckCategory[];
  productMap: Map<string, GoodpluckProduct>;
}

interface FilteredCategory {
  name: string;
  slug: string;
  products: GoodpluckProduct[];
}

const Products: Component<IProps> = ({
  currentCategory,
  categories,
  productMap,
}) => {
  const [searchTerm, setSearchTerm] = createSignal("");

  onMount(() => {
    // Scroll to the currentCategory
    if (currentCategory) {
      const target = document.querySelector(`#${currentCategory.slug}`);
      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 170; // Adjust the offset value (170) based on your navbar's height
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
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
        <For each={getFilteredCategories()}>
          {({ name, slug, products }) => (
            <div class="my-12">
              <h1
                class="text-3xl sm:text-5xl font-bold text-green-600 mb-4 scroll-mt-20 sticky top-20 bg-white p-2"
                id={slug}
              >
                {name}
              </h1>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={products}>
                  {(product) => <Product product={product} />}
                </For>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default Products;
