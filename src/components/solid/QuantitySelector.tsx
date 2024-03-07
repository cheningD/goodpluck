import { type Component } from "solid-js";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (arg0: number) => void;
}

const QuantitySelector: Component<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
}) => {
  const handleQuantityChange = (event: { target: { value: string } }): void => {
    setQuantity(parseInt(event.target.value));
  };

  const options = [];
  for (let i = 1; i <= 10; i++) {
    options.push(
      <option value={i} selected={quantity === i}>
        {i}
      </option>,
    );
  }

  return (
    <div>
      <select
        class="rounded-md h-9 my-2"
        value={quantity}
        onChange={handleQuantityChange}
      >
        {options}
      </select>
    </div>
  );
};

export default QuantitySelector;
