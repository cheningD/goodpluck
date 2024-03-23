import type { GoodpluckCategory } from "src/lib/types";
import { For, Show, createMemo, type Component, type JSX } from "solid-js";

interface SidebarMenuProps {
  categorySlug: string;
  categories: GoodpluckCategory[];
}

interface EnhancedCategory extends GoodpluckCategory {
  isSelected: boolean;
  subcategories: EnhancedCategory[];
}

const structureCategories = (
  categories: GoodpluckCategory[],
  selectedSlug: string,
): EnhancedCategory[] => {
  const categoryMap: Record<string, EnhancedCategory> = categories.reduce(
    (map, category) => ({
      ...map,
      [category.id]: {
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
      const child = categoryMap[category.id];
      if (!parent || !child) {
        return;
      }
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

const CategoryItem = ({
  category,
}: {
  category: EnhancedCategory;
}): JSX.Element => (
  <li class="py-5 !m-0 border-b border-brand-off-white last:border-b-0 font-bold">
    <div
      class={`text-custom-gray text-sm ${
        category.isSelected ? "border-l-2 border-brand-red pl-2 mb-4" : ""
      }`}
    >
      <a
        href={`/market/${category.slug}`}
        class="category-link text-sm text-brand-black pb-2"
      >
        {category.name}
      </a>
    </div>
    <Show when={category.subcategories.length && category.isSelected}>
      <SubcategoryList subcategories={category.subcategories} />
    </Show>
  </li>
);

const SubcategoryList = ({
  subcategories,
}: {
  subcategories: EnhancedCategory[];
}): JSX.Element => (
  <ul class="subcategories-list pl-4">
    <For each={subcategories}>
      {(subcategory) => (
        <li class="py-3 last:pb-0">
          <div
            class={`text-sm ${
              subcategory.isSelected ? "border-l-2 border-brand-red pl-2" : ""
            }`}
          >
            <a
              href={`/market/${subcategory.slug}`}
              class={`text-sm ${
                subcategory.isSelected ? "text-brand-black" : "text-custom-gray"
              }`}
            >
              {subcategory.name}
            </a>
          </div>
        </li>
      )}
    </For>
  </ul>
);

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
      <div id="sidebar-heading" class="pb-5 border-b border-custom-silver w-48">
        <h2 class="text-brand-black uppercase text-sm font-bold leading-tight tracking-wide">
          Browse by Category
        </h2>
      </div>
      <ul class="sidebar-categories space-y-2 gap-5 w-48">
        <For each={menuCategories()} fallback={<div>Loading...</div>}>
          {(category) => <CategoryItem category={category} />}
        </For>
      </ul>
    </aside>
  );
};

export default SidebarMenu;
