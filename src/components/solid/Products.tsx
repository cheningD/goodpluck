import type { SwellCategoryResponse } from "@src/lib/swell";
import { For, Show, type Component, onMount } from "solid-js";
import type { Product } from "swell-js";

interface IProps {
  currentCategory: SwellCategoryResponse;
  categories: SwellCategoryResponse[];
  productMap: Map<string, Product>;
}

const Products: Component<IProps> = ({
  currentCategory,
  categories,
  productMap,
}) => {
  onMount(() => {
    // Scroll to the currentCategory
    const hash = `#${currentCategory.slug}`;
    if (hash) {
      console.log("hash", hash);
      const target = document.querySelector(hash);
      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.pageYOffset - 90; // Adjust the offset value (80) based on your navbar's height
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  });

  return (
    <div>
      <For each={categories}>
        {(category) => (
          <div class="mb-8">
            <h1 class="text-2xl font-bold mb-4 scroll-mt-20" id={category.slug}>
              {category.name}
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <For each={category.products.results}>
                {(p) => (
                  <div>
                    <a href={`/product/${productMap.get(p.product_id)?.slug}`}>
                      <Show
                        when={
                          productMap.get(p.product_id)?.images !== undefined
                        }
                      >
                        <img
                          class="h-[200px] w-full object-cover"
                          alt={`Image of ${productMap.get(p.product_id)?.name}`}
                          src={
                            productMap.get(p.product_id)?.images?.[0]?.file
                              ?.url ?? "via.placeholder.com/300x200"
                          }
                          width="300"
                          height="200"
                          loading="lazy"
                          decoding="async"
                        />
                      </Show>
                      <button
                        aria-label="Add to Cart"
                        type="button"
                        class="mt-2"
                      >
                        Add
                      </button>
                    </a>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default Products;
