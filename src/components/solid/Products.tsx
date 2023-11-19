import { Show, type Component } from "solid-js";

interface IProps {
  products: any;
}

const Products: Component<IProps> = ({ products }) => {
  return (
    <>
      <ul class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {products.results.map((product: any) => (
          <li class="flex flex-col gap-y-2">
            <div class="relative rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-52">
            <Show when={product.images != undefined}>
            <img
                src={product.images[0].file.url}
                class="absolute w-full h-full rounded-xl"
              />
            </Show>
              <button
                type="button"
                class="absolute bottom-2 right-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-gray-900 text-white bg-gray-800 shadow-sm hover:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                + Quick add
              </button>
            </div>
            <a class="text-lg font-serif" href={`/product/${product.slug}`}>
              {product.name}
            </a>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">{product.kind}</span>
              <span class="text-right font-semibold">${product.price}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Products;
