import { Show, Component, createSignal, createEffect } from "solid-js";

interface iProps {
  currentCategory: any;
  products: any;
}

const Products: Component<iProps> = (props) => {
  const { products } = props;

  const itemListElement = products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@id": product.url,
      name: product.name,
    },
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElement,
  };

  return (
    <>
      <ul class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-center">
        {products.map((product: any) => (
          <li class="flex flex-col gap-y-2">
            <div class="relative rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-52">
              <a href={`/product/${product.slug}`}>
                <Show when={product.images != undefined}>
                  <img
                    alt={`Image of ${product.name}`}
                    src={product.images[0].file.url}
                    width="305"
                    height="205"
                    loading="lazy"
                    decoding="async"
                    class="absolute w-full h-full rounded-xl"
                  />
                </Show>
                <button
                  aria-label="Add to Cart"
                  type="button"
                  class="absolute bottom-2 right-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-gray-900 text-white bg-gray-800 shadow-sm hover:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  + Quick add
                </button>
              </a>
            </div>
            <h2 class="text-xl font-serif" href={`/product/${product.slug}`}>
              <span class="hidden">Product Name:</span>
              {product.name}
            </h2>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">{product.kind}</span>
              <span class="text-right font-semibold">${product.price}</span>
            </div>
          </li>
        ))}
      </ul>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default Products;
