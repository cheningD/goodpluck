import type { GoodpluckProduct } from "src/lib/types";
import { Show, type Component } from "solid-js";
import { AddToCartButton } from "./AddToCartButton";

export interface ProductProps {
  product: GoodpluckProduct;
}

const Product: Component<ProductProps> = ({ product }) => {
  return (
    <div class="rounded-es-md border border-gray-200 overflow-clip flex flex-col">
      <a href={`/product/${product.slug}`}>
        <Show when={product.images !== undefined}>
          <img
            class="h-[200px] w-full object-cover"
            alt={`Image of ${product.name}`}
            src={
              product.images?.[0]?.file?.url ?? "via.placeholder.com/300x200"
            }
            width="300"
            height="200"
            loading="lazy"
            decoding="async"
          />
        </Show>
        <div class="p-4">
          <p class="text-lg">{product.name}</p>
          <p class="text-gray-500 text-sm">{`${product.vendor.name}`}</p>
        </div>
      </a>
      <div class="mx-4 mb-4 bg-brand-off-white rounded-sm flex flex-col justify-start">
        <div class="flex px-4 py-3">
          <span> ${product.price} • </span>
          <span class="text-gray-500 pl-2">
            {product.unit_quantity} {product.unit.toLowerCase()}
          </span>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
};

export default Product;
