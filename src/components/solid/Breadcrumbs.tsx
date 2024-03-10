import type { GoodpluckCategory, GoodpluckProduct } from "@src/lib/types";
import { Show, For, createMemo, type Component } from "solid-js";

interface IProps {
  categories: GoodpluckCategory[];
  collectionId: string;
  product?: GoodpluckProduct;
}

const findCategoryById = (
  categories: GoodpluckCategory[],
  id: string,
): GoodpluckCategory | null => categories.find((col) => col.id === id) ?? null;

const buildCategoryHierarchy = (
  categories: GoodpluckCategory[],
  categoryId: string,
): GoodpluckCategory[] => {
  const hierarchy = [];
  let currentCategory = findCategoryById(categories, categoryId);

  while (currentCategory) {
    hierarchy.unshift(currentCategory);
    currentCategory = currentCategory.parent_id
      ? findCategoryById(categories, currentCategory.parent_id)
      : null;
  }

  return hierarchy;
};

const Breadcrumbs: Component<IProps> = ({
  categories,
  collectionId,
  product,
}) => {
  const currentCategoryHierarchy = createMemo(() =>
    buildCategoryHierarchy(categories, collectionId),
  );

  if (currentCategoryHierarchy().length === 0) {
    return null;
  }

  // Breadcrumb preparation
  const breadcrumb = createMemo(() => {
    const hierarchy: any[] = [...currentCategoryHierarchy()];
    if (product) {
      hierarchy.push({
        id: product.id ?? "",
        name: product.name,
        slug: product.slug ?? "",
      });
    }
    return hierarchy;
  });

  const websiteDomain = import.meta.env.VITE_WEBSITE_DOMAIN;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb().map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": `${websiteDomain}/${item.slug}`,
        name: item.name,
      },
    })),
  };

  return (
    <div>
      <ol
        class="flex items-center whitespace-nowrap w-full max-w-7xl mx-auto p-4"
        aria-label="Breadcrumbs"
      >
        <For each={breadcrumb()} fallback={<div>Error loading breadcrumb</div>}>
          {(item, i) => (
            <li class="flex items-center">
              <Show
                when={i() < breadcrumb().length - 1}
                fallback={
                  <span class="ms-1 font-medium md:ms-2 text-sm mx-2 text-brand-black">
                    {item.name}
                  </span>
                }
              >
                <a
                  class="ms-1 font-medium md:ms-2 text-sm mx-2 text-brand-black hover:text-custom-gray focus:outline-none focus:text-custom-gray"
                  href={`/market/${item.slug}`}
                >
                  {item.name}
                </a>
                <svg
                  class="rtl:rotate-180 w-3 h-3 text-brand-green mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="m1 9 4-4-4-4"
                  />
                </svg>{" "}
              </Show>
            </li>
          )}
        </For>
      </ol>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbList)}
      </script>
    </div>
  );
};

export default Breadcrumbs;
