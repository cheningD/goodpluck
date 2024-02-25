import { createSignal } from "solid-js";
import { type Component } from "solid-js";
// import { $cart } from "@src/lib/store";
// import { useStore } from "@nanostores/solid";
// import type { GoodpluckCart } from "@src/lib/types";

export const ZipForm: Component = () => {
  const [zipInput, setZipInput] = createSignal("");
  const [error, setError] = createSignal("");
  // const cart = useStore($cart);

  // This function returns a Promise<void>, which we'll call from our event handler
  const submitForm = async (): Promise<void> => {
    if (!/^\d{5}$/.test(zipInput())) {
      setError("Zip code must be 5 digits.");
      // return;
    }

    // try {
    //   const cartID = cart()?.data.id;
    //   const response = await fetch("/api/cart", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ id: cartID, shipping: { zip: zipInput() } }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to update cart");
    //   } else {
    //     const updatedCart = (await response.json()).result as GoodpluckCart;
    //     $cart.set(updatedCart);
    //   }

    //   setError("");
    //   // Handle successful submission here
    // } catch (error) {
    //   setError("An error occurred. Please try again.");
    // }
  };

  const handleSubmit = (event: Event): void => {
    event.preventDefault(); // Prevent default form submission behavior
    submitForm().catch(console.error); // Handle the async operation and errors
  };

  return (
    <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1>Enter Zip</h1>
      <p>First, let's confirm we deliver to you.</p>
      <label for="zipInput">Zip</label>
      <input
        id="zipInput"
        type="text"
        placeholder="e.g. 48123"
        value={zipInput()}
        onInput={(e) => setZipInput(e.currentTarget.value)}
      />
      <button type="submit">Submit</button>
      {error() && <p class="text-red-500">{error()}</p>}
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </form>
  );
};

export default ZipForm;
