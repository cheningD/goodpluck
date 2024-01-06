import { createSignal, createEffect, type Component } from "solid-js";
import algoliasearch from "algoliasearch/lite";
import { setIsSearchVisible } from "../../store";

const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APPLICATION_ID,
  import.meta.env.PUBLIC_ALGOLIA_API_KEY,
);
const index = searchClient.initIndex(import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME);

const AlgoliaSearch: Component = () => {
  const [query, setQuery] = createSignal("");
  const [hits, setHits] = createSignal<any>([]);
  const [debouncedQuery, setDebouncedQuery] = createSignal(query());
  const [, setIsLoading] = createSignal(false);
  const [, setError] = createSignal(null);
  const [isUserInteracted, setIsUserInteracted] = createSignal(false);
  const [isDialogVisible, setIsDialogVisible] = createSignal(false);
  const hideSearch = (): void => {
    setQuery("");
    setIsUserInteracted(false);
    setIsDialogVisible(false);
    setIsSearchVisible(false);
  };

  const performSearch = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { hits } = await index.search(query());
      setHits(hits);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce logic
  createEffect(() => {
    const handler = setTimeout(() => {
      if (isUserInteracted()) {
        setDebouncedQuery(query());
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  });

  // Search effect
  createEffect(() => {
    if (debouncedQuery()) {
      void performSearch();
    }
  });

  const navIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M448 64L64 240.14h200a8 8 0 0 1 8 8V448Z"/></svg>';

  return (
    <>
      <div class="relative py-2 px-4 w-full">
        <div class="flex items-center gap-x-4">
          <label class="hidden lg:flex" for="search-input">
            Search:
          </label>
          <div class="relative w-full">
            <div class="relative flex items-center justify-between gap-x-1">
              <input
                id="search-input"
                type="text"
                class="bg-opacity-50 opacity-100 transition-opacity duration-300 py-3 px-5 block w-10/12 lg:w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                value={query()}
                onInput={(e) => {
                  setIsDialogVisible(true);
                  setIsUserInteracted(true);
                  setQuery(e.currentTarget.value);
                  void performSearch();
                }}
                placeholder="What are you looking for Today?"
              />

              <svg
                onClick={hideSearch}
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 cursor-pointer"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z"
                />
              </svg>
            </div>

            {isDialogVisible() && (
              <div class="absolute mt-14 inset-0 flex justify-center items-start w-full h-[70vh]  overflow-x-hidden overflow-y-auto">
                <div class="bg-slate-200 p-6 shadow-md w-full mx-auto flex flex-col">
                  {hits().length === 0 ? (
                    <>
                      <p class="font-semibold text-orange-600">
                        Sorry, we couldn't find{" "}
                        <span class="font-medium text-black">{query()}</span>
                      </p>
                      <p class="font-semibold text-orange-600">
                        but our support would love to help you find what you're
                        hunting for.
                      </p>

                      <ul class="list-inside list-disc">
                        <li>
                          Check your search term for typos or misspellings.
                        </li>
                        <li>Chat with a friendly customer service.</li>
                      </ul>
                    </>
                  ) : (
                    <ul class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <li class="text-yellow-500 hidden"></li>
                      {hits().map((hit: any) => (
                        <li
                          class="inline-flex items-center justify-between gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                          innerHTML={`<a class="flex w-full justify-between items-center" href="/product/${hit.sku}"><div class="flex justify-between gap-x-1">${hit._highlightResult.name.value}</div> ${navIcon}</a>`}
                        ></li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlgoliaSearch;
