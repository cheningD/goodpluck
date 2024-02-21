import { For, type Component } from "solid-js";
interface NavProps {
  collections: any;
}

const NavMenu: Component<NavProps> = ({ collections }) => {
  return (
    <nav class="hidden lg:flex">
      <ul class="flex space-x-4">
        <For each={collections?.filter((c: any) => c.parent_id === null)}>
          {(item) => (
            <div>
              <li class="relative group">
                <a
                  href={`/market/${item.slug}`}
                  class="pb-1 border-b-2 border-white hover:border-brand-green relative"
                >
                  {item.name}
                </a>
                <div class="absolute left-0 w-72 hidden group-hover:block ">
                  <ul class="bg-white shadow-md mt-7">
                    <For
                      each={collections.filter(
                        (d: any) => d.parent_id === item.id,
                      )}
                    >
                      {(subCollection) => (
                        <li class="px-4 py-2 hover:bg-gray-100">
                          <a href={`/market/${subCollection.slug}`}>
                            {subCollection.name}
                          </a>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </li>
            </div>
          )}
        </For>
      </ul>
    </nav>
  );
};

export default NavMenu;
