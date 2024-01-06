// import { type Component, Show, createSignal } from "solid-js";

// import { swell } from "../../lib/swell";

// interface iProps {
//   currentCategory: any;
// }

// const Products: Component<iProps> = (props) => {
//   const [products, setProducts] = createSignal([]);
//   const [isLoading, setIsLoading] = createSignal(false);
//   const [page, setPage] = createSignal(1);
//   const [totalProducts] = createSignal(122); // total number of products in Swell currently
//   let isFetching = false; // flag to indicate if fetching is in progress

//   const fetchProducts: () => Promise<void> = async () => {
//     if (products().length >= totalProducts() || isFetching) {
//       return;
//     }

//     isFetching = true;
//     setIsLoading(true);
//     const newProducts = await swell.products.list({
//       limit: 10,
//       page: page(),
//     });

//     setProducts([...products(), ...newProducts.results]);
//     isFetching = false;
//     setIsLoading(false);
//     setPage(page() + 1);
//   };

//   // const checkScroll: () => Promise<void> = async () => {
//   //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//   //     await fetchProducts();
//   //   }
//   // };

//   // Throttle the scroll event to prevent rapid firing
//   // const throttledCheckScroll = throttle(checkScroll, 200);

//   // window.addEventListener("scroll", throttledCheckScroll);
//   // await fetchProducts();

//   // onCleanup(() => {
//   //   window.removeEventListener("scroll", throttledCheckScroll);
//   // });

//   const itemListElement = products().map((product, index) => ({
//     "@type": "ListItem",
//     position: index + 1,
//     item: {
//       "@id": product.url,
//       name: product.name,
//     },
//   }));

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     itemListElement,
//   };

//   return (
//     <>
//       <span class="text-4xl text-blue-600">Products:</span>
//       <div>
//         <ul class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-center">
//           {products().map((product: any) => (
//             <li class="flex flex-col gap-y-2">
//               <div class="relative rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-52">
//                 <a href={`/product/${product.slug}`}>
//                   <Show when={product.images !== undefined}>
//                     <img
//                       alt={`Image of ${product.name}`}
//                       src={product.images[0].file.url}
//                       width="305"
//                       height="205"
//                       loading="lazy"
//                       decoding="async"
//                       class="absolute w-full h-full rounded-xl"
//                     />
//                   </Show>
//                   <button
//                     aria-label="Add to Cart"
//                     type="button"
//                     class="absolute bottom-2 right-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-gray-900 text-white bg-gray-800 shadow-sm hover:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                   >
//                     + Quick add
//                   </button>
//                 </a>
//               </div>
//               <h2 class="text-xl font-serif" href={`/product/${product.slug}`}>
//                 <span class="hidden">Product Name:</span>
//                 {product.name}
//               </h2>
//               <div class="flex justify-between items-center">
//                 <span class="text-xs text-gray-600">{product.kind}</span>
//                 <span class="text-right font-semibold">${product.price}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {isLoading() && <div>Loading more products...</div>}
//         {products().length >= totalProducts() && (
//           <div>You've reached the end of products...</div>
//         )}
//       </div>

//       {/* Structured Data */}
//       <script type="application/ld+json">
//         {JSON.stringify(structuredData)}
//       </script>
//     </>
//   );
// };

// export default Products;
