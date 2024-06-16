import type { GoodpluckCategory } from "src/lib/types";
import { For, Show, createMemo, type Component } from "solid-js";
import SubcategoryList from "../SubcategoryList";
import { $activeCategorySlug } from "src/lib/store";
import { useStore } from "@nanostores/solid";

/**
 * Structure and mark categories based on their status and parent-child relationships.
 *
 * @param categories - An array of GoodpluckCategory objects to be structured.
 * @param activeCategorySlug - The slug of the active category.
 * @returns A structured array of GoodpluckCategory objects with nested subcategories and selection status.
 */
const structureCategories = (
  categories: GoodpluckCategory[],
  activeCategorySlug: string,
): GoodpluckCategory[] => {
  if (categories.length === 0) return [];

  if (!activeCategorySlug) activeCategorySlug = categories[0]?.slug ?? "";

  const categoryMap = categories.reduce<Record<string, GoodpluckCategory>>(
    (map, category) => {
      map[category.id] = {
        ...category,
        isActive: category.slug === activeCategorySlug,
        subcategories: [],
      };
      return map;
    },
    {},
  );

  // Link subcategories to their parents and update selection status
  categories.forEach((category) => {
    if (category.parent_id) {
      const parent = categoryMap[category.parent_id];
      const child = categoryMap[category.id];

      if (parent && child) {
        parent.subcategories.push(child);

        // If a parent has only one subcategory, select it
        if (parent.isActive && parent.subcategories.length === 1) {
          child.isActive = true;
        }

        // Propagate selection status from child to parent
        if (child.isActive) {
          parent.isActive = true;
        }
      }
    }
  });

  return Object.values(categoryMap).filter((category) => !category.top_id);
};

const ParentCategoryItem: Component<{ category: GoodpluckCategory }> = ({
  category,
}) => (
  <li class="py-5 !m-0 border-b border-brand-off-white last:border-b-0 font-bold">
    <div
      class={`text-custom-gray text-sm ${category.isActive ? "border-l-2 border-brand-red pl-2 mb-4" : ""}`}
    >
      <a
        href={`/market/${category.slug}`}
        class="category-link text-sm text-brand-black pb-2"
      >
        {category.name}
      </a>
    </div>
    <Show when={category.subcategories.length && category.isActive}>
      <SubcategoryList subcategories={category.subcategories} />
    </Show>
  </li>
);

const SidebarMenu: Component<{
  categories: GoodpluckCategory[];
}> = ({ categories }) => {
  const activeCategorySlug = useStore($activeCategorySlug);

  const menuCategories = createMemo(() =>
    structureCategories(categories, activeCategorySlug()),
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
          {(category) => <ParentCategoryItem category={category} />}
        </For>
      </ul>
    </aside>
  );
};

export default SidebarMenu;
