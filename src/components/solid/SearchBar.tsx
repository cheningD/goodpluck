import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import search from "src/assets/img/search.svg";

interface ISearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: Component<ISearchBarProps> = (props) => {
  const [searchInput, setSearchInput] = createSignal("");

  const handleSearch = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    setSearchInput(input.value);
    props.onSearch(input.value);
  };

  return (
    <div class="hidden lg:flex relative w-64 h-10">
      <input
        class="w-full h-full shrink-0 pl-4 pr-10 bg-transparent rounded-md border-solid focus:border-transparent focus:ring-2  focus:ring-brand-green  border-stone-200 placeholder-stone-400 shadow "
        placeholder="Search"
        type="text"
        value={searchInput()}
        onInput={handleSearch}
      />

      <img
        src={search.src}
        class="shrink-0 absolute right-4 top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};
