import { useStore } from "@nanostores/solid";
import { createSignal, Show, For, type Component } from "solid-js";
import logo from "@assets/logo.png";
import { isCartOpen, isMenuOpen } from "../../../store.js";

interface IProps {
	collections: any;
}

const Sidebar: Component<IProps> = ({ collections }) => {
	const $isCartOpen = useStore(isCartOpen);
	const $isMenuOpen = useStore(isMenuOpen);

	const categories = collections.filter((col) => col.parent_id == null);

	function getSubCategories(parentId) {
		const categories = collections.filter(
			(col) => col.parent_id == parentId,
		);

		if (categories) {
			return categories;
		}
		return [];
	}

	return (
		<>
			<div
				id="navbar-collapse-with-animation"
				id="navbar-collapse-with-animation"
				class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:flex lg:justify-center"
			>
				<div class="flex flex-col gap-x-0 mt-5 divide-y divide-dashed divide-gray-200 lg:flex-row lg:items-center lg:justify-end lg:gap-x-7 lg:mt-0 lg:ps-7 lg:divide-y-0 lg:divide-solid dark:divide-gray-700">
					<For each={categories}>
						{(collection, i) => (
							<Show
								when={
									getSubCategories(collection.id).length == 0
								}
								fallback={
									<div class="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] py-3 md:py-6">
										<a class="flex items-center w-full text-gray-800 hover:text-gray-600 font-medium dark:text-gray-200 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
											{collection.name}
											<svg
												class="ms-2 flex-shrink-0 w-4 h-4"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="m6 9 6 6 6-6" />
											</svg>
										</a>

										<div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 md:w-80 hidden z-10 bg-white md:shadow-2xl rounded-lg py-2 md:p-2 dark:bg-gray-800 dark:divide-gray-700 before:absolute top-full before:-top-5 before:start-0 before:w-full before:h-5">
											<For
												each={getSubCategories(
													collection.id,
												)}
											>
												{(subCollection, i) => (
													<a
														class="inline-flex gap-x-5 w-full p-4 text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
														href={`/market/${subCollection.slug}`}
													>
														{subCollection.name}
													</a>
												)}
											</For>
										</div>
									</div>
								}
							>
								<a class="font-medium text-gray-500 hover:text-gray-400 py-3 lg:py-6 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
									{collection.name}
								</a>
							</Show>
						)}
					</For>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
