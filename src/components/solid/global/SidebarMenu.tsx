import { For, Show, type Component } from "solid-js";
import type { Category } from "swell-js";

interface SidebarMenuProps {
  categorySlug: string;
  categories: Category[];
}

const SidebarMenu: Component<SidebarMenuProps> = ({
  categorySlug,
  categories,
}) => {
  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const firstChildOfSelectedParentId = categories.find(
    (category) =>
      selectedCategory && category.parent_id === selectedCategory.id,
  )?.id;

  // Check if the category is selected or if it's a subcategory of the selected category
  const isSelectedOrSubcategory = (category: Category): boolean =>
    !!selectedCategory &&
    (category.id === selectedCategory.id ||
      category.id === selectedCategory.parent_id ||
      category.id === firstChildOfSelectedParentId);

  const rootCategories = categories.filter(
    (category) => category.top_id === null,
  );

  const subCategories = categories.filter(
    (category) =>
      selectedCategory &&
      (category.parent_id === selectedCategory.id ||
        category.parent_id === selectedCategory.parent_id),
  );

  return (
    <aside
      class="sidebar-menu hidden md:flex flex-col items-start px-10 py-4 w-72"
      aria-labelledby="sidebar-heading"
      data-testid="desktop-sidebar"
    >
      <div id="sidebar-heading" class="pb-4 border-b border-[#00000013] w-48">
        <h2 class="text-[#403C3B] uppercase text-sm font-bold leading-tight tracking-wide">
          Browse by Category
        </h2>
      </div>
      <ul class="sidebar-categories space-y-2 gap-5 w-48">
        <For each={rootCategories}>
          {(category) => (
            <li class="py-4 !m-0 border-b border-[#00000007] last:border-b-0">
              <div
                class={`text-[#838383] text-sm ${
                  isSelectedOrSubcategory(category)
                    ? "border-l-2 border-[#EE5A44] pl-2 mb-4"
                    : ""
                }`}
              >
                <a
                  href={`/market/${category.slug}`}
                  class="category-link text-sm text-[#403C3B] pb-2"
                >
                  {category.name}
                </a>
              </div>
              <Show when={isSelectedOrSubcategory(category)}>
                <ul class="subcategories-list pl-4">
                  <For
                    each={subCategories.filter(
                      (subCategory) => subCategory.parent_id === category.id,
                    )}
                  >
                    {(subCategory) => (
                      <li class="text-[#838383] py-3">
                        <div
                          class={`text-[#838383] text-sm ${
                            isSelectedOrSubcategory(subCategory)
                              ? "border-l-2 border-[#EE5A44] pl-2"
                              : ""
                          }`}
                        >
                          <a
                            href={`/market/${subCategory.slug}`}
                            class={`text-[#838383] text-sm ${
                              isSelectedOrSubcategory(subCategory)
                                ? "!text-[#403C3B]"
                                : ""
                            }`}
                          >
                            {subCategory.name}
                          </a>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
};

export default SidebarMenu;
