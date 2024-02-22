import right from "@assets/img/right.svg";
import search from "@assets/img/search.svg";
import user from "@assets/img/user.svg";
import { For, Show, createSignal, type Component } from "solid-js";

interface NavProps {
  collections: any[];
}

const SideMenu: Component<NavProps> = ({ collections }) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [expandedId, setExpandedId] = createSignal(null);
  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen());
    setExpandedId(null);
  };

  return (
    <div class="lg:hidden">
      <button
        onClick={toggleIsOpen}
        class="flex flex-col justify-center items-center"
      >
        <span
          class={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen() ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                    }`}
        ></span>
        <span
          class={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      isOpen() ? "opacity-0" : "opacity-100"
                    }`}
        ></span>
        <span
          class={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen() ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                    }`}
        ></span>
      </button>
      <Show when={isOpen()}>
        <div class="absolute top-20 left-0 w-screen flex h-[calc(100vh-80px)]">
          <div class="w-7/12  bg-white border-r-4 border-gray-300 p-4 flex flex-col">
            {/* Search */}
            <div class="relative w-full h-10 my-2">
              <input
                class="w-full h-full shrink-0 pl-4 pr-10 bg-transparent rounded-md border-solid focus:border-transparent focus:ring-2  focus:ring-brand-green  border-stone-200 placeholder-stone-400 shadow "
                placeholder="Search"
                type="text"
              />

              <img
                src={search.src}
                class="shrink-0 absolute right-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
            {/* Nav Menu */}
            <For each={collections.filter((c) => c.parent_id === null)}>
              {(item) => (
                <>
                  <Show when={expandedId() === null}>
                    <li
                      class="flex justify-between items-center cursor-pointer py-2  border-b border-gray-100"
                      onclick={() =>
                        setExpandedId(expandedId() === null ? item.id : null)
                      }
                    >
                      <span>{item.name}</span>
                      <span
                        style={{ "background-image": `url(${right.src})` }}
                        class=" w-3 h-3 shrink-0  bg-cover bg-no-repeat relative overflow-hidden "
                      />
                    </li>
                  </Show>
                  <Show when={expandedId() === item.id}>
                    <div class="flex items-center py-2 pl-2 ">
                      <button
                        onClick={() => setExpandedId(null)}
                        style={{ "background-image": `url(${right.src})` }}
                        class=" w-4 h-4 shrink-0  bg-cover bg-no-repeat relative overflow-hidden rotate-180 mr-4"
                      />

                      <div class="flex-1 font-semibold border-b border-gray-100">
                        <a href={`/market/${item.slug}`}>{item.name}</a>
                      </div>
                    </div>
                    <ul class="pl-10">
                      <For
                        each={collections.filter(
                          (d) => d.parent_id === item.id,
                        )}
                      >
                        {(subCollection) => (
                          <li class="py-2 border-b border-gray-100">
                            <a href={`/market/${subCollection.slug}`}>
                              {subCollection.name}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </>
              )}
            </For>
            {/* Account */}
            <div class="flex items-center justify-around mt-4">
              <button
                style={{ "background-image": `url(${user.src})` }}
                class=" w-5 h-5 shrink-0  bg-cover bg-no-repeat relative overflow-hidden "
              />
              <a href="/login">Log in</a> | <a href="/join">Sign up</a>
            </div>
          </div>

          <div
            onClick={toggleIsOpen}
            class=" bg-brand-green  opacity-25 flex-1"
          />
        </div>
      </Show>
    </div>
  );
};

export default SideMenu;
