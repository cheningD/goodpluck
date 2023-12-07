import { createSignal, Component, Show } from "solid-js";

interface IProps {
  categorySlug: any;
  categories: any;
}

const ScrollSpy: Component<IProps> = ({ categorySlug, categories }) => {
  let checkCategory = categories.find((col) => col.slug === categorySlug);
  let collectionSlug = checkCategory.parent_id
    ? categorySlug
    : categories.filter((col) => col.parent_id === checkCategory.id)[0].slug;
  let categoryHasChild =
    categories.filter((col) => col.parent_id === checkCategory.id).length > 0
      ? categories.filter((col) => col.parent_id === checkCategory.id)[0]
      : null;

  if (categoryHasChild) {
    collectionSlug = categoryHasChild.slug;
  }

  let currentCategory = categories.find(
    (category) => category.slug === collectionSlug,
  );

  let parentCategory = categories.find(
    (col) => col.id === currentCategory.parent_id,
  );

  let categoryParentsCount = 0;
  let topLevelCategory = parentCategory ? parentCategory : currentCategory;

  while (parentCategory) {
    categoryParentsCount++;
    topLevelCategory = parentCategory;
    parentCategory = categories.find(
      (col) => col.id === parentCategory.parent_id,
    );
  }

  const getChildCategories = (parentCategoryId) =>
    categories.filter((category) => category.parent_id === parentCategoryId);

  return (
    <>
      <div
        data-testid="desktop-sidebar"
        class="hidden md:flex flex-col items-start px-10 py-4"
      >
        <a
          data-testid="top-level-category"
          class="text-3xl font-medium dark:text-white"
          href={`/market/${topLevelCategory.slug}`}
        >
          {topLevelCategory.name}
        </a>
        <hr class="border-gray-300 h-1 w-10/12 mx-auto"></hr>
        <Show when={categoryParentsCount > 0}>
          <ul class="sticky top-[114px] flex flex-col gap-y-3">
            {getChildCategories(topLevelCategory.id).map((collection) => (
              <li>
                <a
                  href={`/market/${collection.slug}`}
                  class={
                    collection.slug === currentCategory.slug ||
                    collection.id === currentCategory.parent_id
                      ? "font-bold !text-teal-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none  dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                      : "font-medium  !text-slate-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                  }
                >
                  {collection.name}
                </a>
                <Show
                  when={
                    collection.id === currentCategory.id &&
                    categoryParentsCount === 1 &&
                    getChildCategories(collection.id).length > 0
                  }
                >
                  <ul
                    data-testid="second-level-category"
                    class="border-l-4 my-3 border-gray-300 pl-4 top-[114px] flex flex-col gap-y-3"
                  >
                    {getChildCategories(collection.id).map((collection) => (
                      <li>
                        <a
                          href={`/market/${collection.slug}`}
                          class={
                            collection.slug === currentCategory.slug
                              ? "font-bold !text-teal-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                              : "font-medium !text-slate-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                          }
                        >
                          {collection.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Show>
                <Show
                  when={
                    collection.id === currentCategory.parent_id &&
                    categoryParentsCount === 2 &&
                    getChildCategories(currentCategory.parent_id).length > 0
                  }
                >
                  <ul
                    data-testid="third-level-category"
                    class="border-l-4 my-3 border-gray-300 pl-4 top-[114px] flex flex-col gap-y-3"
                  >
                    {getChildCategories(currentCategory.parent_id).map(
                      (collection) => (
                        <li>
                          <a
                            href={`/market/${collection.slug}`}
                            class={
                              collection.slug === currentCategory.slug
                                ? "font-bold !text-teal-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                                : "font-medium !text-slate-700 block py-0.5 text-md leading-6 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300 dark:focus:text-blue-500 hs-scrollspy-active:text-blue-600 dark:hs-scrollspy-active:text-blue-400 active"
                            }
                          >
                            {collection.name}
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </Show>
              </li>
            ))}
          </ul>
        </Show>
      </div>
    </>
  );
};

export default ScrollSpy;
