import { Show, type Component, createSignal, onCleanup } from "solid-js";
import { initSwell } from "../../lib/swell-js";
import { throttle } from "../../lib/throttle";

interface IProps {
  currentCategory: string | undefined;
}

const Products: Component<IProps> = ({ currentCategory }) => {
  const swell = initSwell(
    import.meta.env.PUBLIC_SWELL_STORE_ID,
    import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
  );

  const [products, setProducts] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [page, setPage] = createSignal(1);
  const [totalProducts, setTotalProducts] = createSignal(0);
  setTotalProducts(122); // total number of products in Swell currently
  let isFetching = false; // flag to indicate if fetching is in progress
  const [error, setError] = createSignal(false);
  const [errorMsg, setErrorMsg] = createSignal("");

  const fetchProducts = async (): Promise<void> => {
    if (products().length >= totalProducts() || isFetching) {
      return;
    }

    isFetching = true;
    setError(false);
    setErrorMsg("");
    setIsLoading(true);

    try {
      let newProducts = [];
      newProducts.results = [];
      if (currentCategory !== "") {
        newProducts = await swell.products.list({
          category: `${currentCategory}`, // Slug or ID
          limit: 10,
          page: page(),
        });
      } else {
        newProducts = await swell.products.list({
          limit: 10,
          page: page(),
        });
      }

      setProducts([...products(), ...newProducts.results]);
      setPage(page() + 1);
    } catch (err) {
      setError(true);
      setErrorMsg("Failed to load products. Try again later.");
    }

    isFetching = false;
    setIsLoading(false);
  };

  const checkScroll = async (): Promise<void> => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      await fetchProducts();
    }
  };

  // Throttle the scroll event to prevent rapid firing
  const throttledCheckScroll = throttle(checkScroll, 200);

  window.addEventListener("scroll", throttledCheckScroll);
  void fetchProducts();

  onCleanup(() => {
    window.removeEventListener("scroll", throttledCheckScroll);
  });

  const itemListElement = products().map((product, index) => ({
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
    itemListElement,
  };

  return (
    <>
      <span class="text-4xl text-blue-600" data-testid="product-list">
        Products:
      </span>
      <div>
        {error() && <div data-testid="product-error">Error:{errorMsg()}</div>}
        <Show when={products().length > 0}>
          <ul
            data-testid="product-items"
            class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-center"
          >
            {products().map((product: any) => (
              <li class="flex flex-col gap-y-2">
                <div class="relative rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-52">
                  <a href={`/product/${product.slug}`}>
                    <Show when={product.images !== undefined}>
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
                <h2
                  class="text-xl font-serif"
                  href={`/product/${product.slug}`}
                >
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
        </Show>
        {isLoading() && (
          <div class="text-red-500">Loading more products...</div>
        )}
        {products().length >= totalProducts() && (
          <div>You've reached the end of products...</div>
        )}
        {products().length === 0 && (
          <div data-testid="no-products">
            No product found in this category!
          </div>
        )}
        {error() && (
          <button
            data-testid="retry-fetch"
            onClick={() => {
              fetchProducts().catch((error) => {
                // Handle any errors that occur during fetchProducts
                setError(true);
                setErrorMsg(error);
              });
            }}
          >
            Retry
          </button>
        )}
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default Products;
