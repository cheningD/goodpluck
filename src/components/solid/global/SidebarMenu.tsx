import { For, Show, createMemo, type Component } from "solid-js";
import type { Category } from "swell-js";

interface SidebarMenuProps {
  categorySlug: string;
  categories: Category[];
}

interface EnhancedCategory extends Category {
  isSelected: boolean;
  subcategories: EnhancedCategory[];
}

const structureCategories = (
  categories: Category[],
  selectedSlug: string,
): EnhancedCategory[] => {
  const categoryMap: Record<string, EnhancedCategory> = categories.reduce(
    (map, category) => ({
      ...map,
      [category.id as string]: {
        ...category,
        isSelected: category.slug === selectedSlug,
        subcategories: [],
      },
    }),
    {},
  );

  // Link subcategories to their parents
  categories.forEach((category) => {
    if (category.parent_id) {
      const parent = categoryMap[category.parent_id];
      const child = categoryMap[category.id as string];
      parent.subcategories.push(child);
      // If the parent is selected, select the first child
      if (parent.isSelected && parent.subcategories.length === 1) {
        child.isSelected = true;
      }
      if (child.isSelected) {
        parent.isSelected = true;
      }
    }
  });

  return Object.values(categoryMap).filter((category) => !category.top_id);
};

const SidebarMenu: Component<SidebarMenuProps> = ({
  categorySlug,
  categories,
}) => {
  const menuCategories = createMemo(() =>
    structureCategories(categories, categorySlug),
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
        <For each={menuCategories()} fallback={<div>Loading...</div>}>
          {(category) => (
            <li class="py-4 !m-0 border-b border-[#00000007] last:border-b-0">
              <div
                class={`text-[#838383] text-sm ${
                  category.isSelected
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
              <Show when={category.subcategories.length && category.isSelected}>
                <ul class="subcategories-list pl-4">
                  <For each={category.subcategories}>
                    {(subcategory) => (
                      <li class="text-[#838383] py-3">
                        <div
                          class={`text-[#838383] text-sm ${
                            subcategory.isSelected
                              ? "border-l-2 border-[#EE5A44] pl-2"
                              : ""
                          }`}
                        >
                          <a
                            href={`/market/${subcategory.slug}`}
                            class={`text-[#838383] text-sm ${
                              subcategory.isSelected ? "!text-[#403C3B]" : ""
                            }`}
                          >
                            {subcategory.name}
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
