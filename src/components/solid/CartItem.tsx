import { type Component } from "solid-js";
import type { GoodpluckCartItem } from "src/lib/types";
import QuantitySelector from "./QuantitySelector";

const CartItem: Component<GoodpluckCartItem> = ({
  quantity,
  product,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  price_total,
}) => {
  return (
    <div class="flex gap-4 py-2">
      <img
        class="w-20 h-20 object-cover rounded-sm"
        src={
          product?.images?.[0]?.file?.url ?? "https://via.placeholder.com/90"
        }
        alt={product.name ?? "Product Image"}
      />
      <div class="flex-1 text-sm">
        <p class="font-semibold">{product.name}</p>
        <p class="text-gray-600 pb-2">{product.vendor?.name}</p>
        <p class="text-gray-800">
          {product?.unit_quantity} {product?.unit}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <p>${price_total}</p>
        {quantity && product.id && (
          <QuantitySelector quantity={quantity} productId={product.id} />
        )}
      </div>
    </div>
  );
};

export default CartItem;
