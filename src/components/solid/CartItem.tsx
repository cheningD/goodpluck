import { type Component } from "solid-js";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  imgsrc: string | null;
  productName: string;
  vendorName: string;
  quantity: number;
  unit: string;
  unitQuantity: string;
  priceDollars: number;
}

const CartItem: Component<CartItemProps> = ({
  imgsrc,
  productName,
  vendorName,
  quantity,
  unit,
  unitQuantity,
  priceDollars,
}) => {
  const imgurl = imgsrc ?? "https://via.placeholder.com/90";
  return (
    <div class="flex gap-4 py-4">
      <img class="h-[90px] rounded-sm" src={imgurl} alt={productName} />
      <div class="flex-1">
        <p class="font-semibold">{productName}</p>
        <p class="text-gray-600 pb-2">{vendorName}</p>
        <p class="text-gray-800">
          {unitQuantity} {unit}
        </p>
      </div>
      <div>
        <p class="font-semibold mb-2">${priceDollars}</p>
        <p>
          <QuantitySelector
            quantity={quantity}
            setQuantity={(num) => {
              console.log(`Setting the qunatity ${num}`);
            }}
          />
        </p>
        <button class="text-brand-green underline">Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
