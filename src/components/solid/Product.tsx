import type { GoodpluckProduct } from "@src/lib/types";
import { Show, type Component } from "solid-js";
import { AddToCartButton } from "./AddToCartButton";

export interface ProductProps {
  product: GoodpluckProduct;
}

const Product: Component<ProductProps> = ({ product }) => {
  return (
    <div>
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
        <p>{product.name}</p>
        <p>{`${product.unit_quantity} ${product.unit}`}</p>
        <p>${product.price}</p>
      </a>{" "}
      <AddToCartButton productId={product.id} />
    </div>
  );
};

export default Product;
