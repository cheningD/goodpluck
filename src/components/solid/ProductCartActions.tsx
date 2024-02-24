import type { WeightOption } from "@src/lib/types";
import { createSignal, type Component } from "solid-js";

interface IProps {
  cost: string | undefined;
  options: WeightOption[];
}

const ProductCartActions: Component<IProps> = ({ cost, options }) => {
  const [quantity, setQuantity] = createSignal(1);

  return (
    <section
      id="product-cart-actions"
      class="mb-24 w-full grid lg:grid-cols-2 grid-cols-1 gap-0 border border-brand-yellow"
    >
      <div
        id="selection-options"
        class="flex items-center justify-between p-6 border-brand-yellow border-b lg:border-r lg:border-b-0"
      >
        <span class="text-2xl font-bold">Options</span>
        <div class="grid md:grid-cols-3 grid-cols-1 gap-3 justify-center items-center">
          {options?.map((o) => (
            <div class="flex items-center justify-center">
              <input
                type="radio"
                id={`option-${o.id}`}
                name="productOption"
                value={o.id}
                class="hidden peer"
                required
              />
              <label
                for={`option-${o.id}`}
                class="inline-flex items-center justify-center w-32 h-4 p-5 bg-brand-cream text-lg text-brand-black cursor-pointer peer-checked:bg-brand-green peer-checked:text-white"
              >
                <div class="font-semibold">{o.name}</div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div
        id="cart-interaction"
        class="p-6 flex md:flex-row flex-col items-center justify-evenly"
      >
        <div
          id="quantity-modifier"
          class="flex items-center mb-4 md:mr-4 md:mb-0"
        >
          <button
            class="px-3 py-2 text-lg"
            onClick={() => setQuantity(Math.max(1, quantity() - 1))}
          >
            -
          </button>
          <span class="px-4 text-lg">{quantity()}</span>
          <button
            class="px-3 py-2 text-lg"
            onClick={() => setQuantity(quantity() + 1)}
          >
            +
          </button>
        </div>
        <div id="add-to-cart-area" class="flex items-center">
          <button class="flex items-center justify-center w-full h-12 py-4 px-8 text-lg text-white bg-brand-red">
            <span>Add to cart</span>
            <span class="mx-4">&#9679;</span>
            <span>${cost}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCartActions;
