import { For } from "solid-js";

const Breadcrumb = (props) => {
  const { collections, currentCollectionId } = props;

  const findParentPath = (collectionId) => {
    let path = [];
    let current = collections.find((col) => col.id === collectionId);

    while (current) {
      path.unshift(current);
      current = collections.find((col) => col.id === current.parent_id);
    }

    return path;
  };

  const parentPath = findParentPath(currentCollectionId);

  const websiteDomain = import.meta.env.VITE_WEBSITE_DOMAIN;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parentPath.map((collection, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": `${websiteDomain}/${collection.slug}`,
        name: collection.name,
      },
    })),
  };

  return (
    <div>
      <ol
        class="flex items-center whitespace-nowrap w-full max-w-7xl mx-auto p-4"
        aria-label="Breadcrumb"
      >
        <li class="inline-flex items-center">
          <a
            class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
            href="/market"
          >
            Home
          </a>
        </li>
        <For each={parentPath} fallback={<div>Loading...</div>}>
          {(collection, i) => (
            <>
              <li
                class={
                  collection.id !== currentCollectionId
                    ? "inline-flex items-center"
                    : "inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-gray-200"
                }
              >
                <svg
                  class="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>

                {collection.id !== currentCollectionId ? (
                  <a
                    class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
                    href={`/market/${collection.slug}`}
                  >
                    {collection.name}
                  </a>
                ) : (
                  collection.name
                )}
              </li>
            </>
          )}
        </For>
      </ol>

      {/* {Structured Data} */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbList)}
      </script>
    </div>
  );
};

export default Breadcrumb;
