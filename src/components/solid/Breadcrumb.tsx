import { Show, For } from "solid-js";

const Breadcrumb = (props) => {
  const { categories, collectionId } = props;

  let checkCategory = categories.find((col) => col.id === collectionId);
  let categoryId = checkCategory.parent_id
    ? collectionId
    : categories.filter((col) => col.parent_id === collectionId)[0].id;

  let categoryHasChild =
    categories.filter((col) => col.parent_id === checkCategory.id).length > 0
      ? categories.filter((col) => col.parent_id === checkCategory.id)[0]
      : null;

  if (categoryHasChild) {
    categoryId = categoryHasChild.id;
  }

  let currentCategory = categories.find((col) => col.id === categoryId);
  let parentCategory = categories.find(
    (col) => col.id === currentCategory.parent_id,
  );

  let breadcrumb = [];
  breadcrumb.push(currentCategory);

  if (parentCategory && parentCategory.parent_id) {
    breadcrumb.unshift(parentCategory);
  }

  let categoryParentsCount = 0;
  let topLevelCategory = parentCategory ? parentCategory : currentCategory;

  while (parentCategory) {
    categoryParentsCount++;
    topLevelCategory = parentCategory;
    parentCategory = categories.find(
      (col) => col.id === parentCategory.parent_id,
    );
  }

  if (categoryParentsCount === 0) {
  }

  const websiteDomain = import.meta.env.VITE_WEBSITE_DOMAIN;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((collection, index) => ({
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
        <li class="flex md:hidden">
          <a
            class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
            href={`/market/${topLevelCategory.slug}`}
          >
            {topLevelCategory.name}
          </a>
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
        </li>
        <For each={breadcrumb} fallback={<div>Error loading breadcrumb</div>}>
          {(collection, i) => (
            <>
              <li
                class={
                  collection.id !== categoryId
                    ? "inline-flex items-center"
                    : "inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-gray-200"
                }
              >
                <Show when={i() > 0}>
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
                </Show>

                {collection.id !== categoryId ? (
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
