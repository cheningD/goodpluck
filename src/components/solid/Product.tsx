import type { GoodpluckProduct } from "src/lib/types";
import { Show, type Component } from "solid-js";
import { AddToCartButton } from "./AddToCartButton";

export interface ProductProps {
  product: GoodpluckProduct;
}

const Product: Component<ProductProps> = ({ product }) => {
  return (
    <div class="sm:rounded-md sm:border border-gray-200 overflow-clip flex sm:flex-col w-full justify-stretch">
      <Show when={product.images !== undefined}>
        <img
          class="sm:h-[200px] w-1/4 sm:w-full object-cover"
          alt={`Image of ${product.name}`}
          src={product.images?.[0]?.file?.url ?? "via.placeholder.com/300x200"}
          width="300"
          height="200"
          loading="lazy"
          decoding="async"
        />
      </Show>
      <div class=" flex flex-col justify-between flex-1 sm:p-4">
        <div class="px-2 sm:px-0">
          <p class="text-lg">{product.name}</p>
          <p class="text-gray-500 text-sm">{`${product.vendor.name}`}</p>
        </div>
        <div class="w-full bg-brand-off-white sm:rounded-sm flex sm:flex-col justify-stretch sm:justify-start mt-3">
          <div class="flex p-2 flex-1 w-1/2 sm:w-full">
            <span> ${product.price}</span>
            <span class="text-gray-500 pl-2">
              {product.unit_quantity} {product.unit.toLowerCase()}
            </span>
          </div>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default Product;
