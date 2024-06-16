import type { GoodpluckCategory } from "src/lib/types";
import { type Component, For } from "solid-js";

const SubcategoryList: Component<{ subcategories: GoodpluckCategory[] }> = ({
  subcategories,
}) => {
  return (
    <ul class="subcategories-list pl-4">
      <For each={subcategories}>
        {(subcategory) => (
          <li class="py-3 last:pb-0">
            <div
              class={`text-sm ${subcategory.isActive ? "border-l-2 border-brand-red pl-2" : ""}`}
            >
              <a
                href={`/market/${subcategory.slug}`}
                class={`text-sm ${subcategory.isActive ? "text-brand-black" : "text-custom-gray"}`}
              >
                {subcategory.name}
              </a>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
};

export default SubcategoryList;
