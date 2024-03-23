import type { GoodpluckCategory, GoodpluckProduct } from "src/lib/types";
import { For, type Component, onMount } from "solid-js";
import Product from "./Product";

interface IProps {
  currentCategory?: GoodpluckCategory | undefined;
  categories: GoodpluckCategory[];
  productMap: Map<string, GoodpluckProduct>;
}

const Products: Component<IProps> = ({
  currentCategory,
  categories,
  productMap,
}) => {
  onMount(() => {
    if (!currentCategory) {
      return;
    }
    // Scroll to the currentCategory
    const hash = `#${currentCategory.slug}`;
    if (hash) {
      console.log("hash", hash);
      const target = document.querySelector(hash);
      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 170; // Adjust the offset value (80) based on your navbar's height
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
                {(p) => {
                  const product = productMap.get(p.product_id);
                  if (!product) {
                    return null;
                  }
                  return <Product product={product} />;
                }}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default Products;
